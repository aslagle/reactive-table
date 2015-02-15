var ReactiveTableCounts = new Mongo.Collection("reactive-table-counts");

var get = function(obj, field) {
  var keys = field.split('.');
  var value = obj;

  _.each(keys, function (key) {
      if (_.isObject(value) && _.isFunction(value[key])) {
          value = value[key]();
      } else if (_.isObject(value) && !_.isUndefined(value[key])) {
          value = value[key];
      } else {
          value = null;
      }
  });

  return value;
};


var updateFilter = _.debounce(function (template, filterText) {
    template.context.filter.set(filterText);
    template.context.currentPage.set(0);
}, 200);

var updateHandle = _.debounce(function () {
    var context = this;
    if (context.server) {
        var newHandle;

        // Could use the table id, but this way we can wait to change the
        // page until the new data is ready, so it doesn't move around
        // while rows are added and removed
        var publicationId = _.uniqueId();
        var newPublishedRows = new Mongo.Collection('reactive-table-rows-' + publicationId);
        context.nextPublicationId.set(publicationId);

        var rowsPerPage = context.rowsPerPage.get();
        var currentPage = context.currentPage.get();
        var currentIndex = currentPage * rowsPerPage;

        var options = {
            skip: currentIndex,
            limit: rowsPerPage
        };
        var sortQuery = {};

        var currentSortField = _.findWhere(context.fields, {fieldId: context.sortKey.get()});
        if (currentSortField) {
            sortQuery[currentSortField.key] = context.sortDirection.get();
        }
        options.sort = sortQuery;
        var filter = context.filter.get();

        var onReady = function () {
            if (publicationId === context.nextPublicationId.get()) {
                context.ready.set(true);
                context.publicationId.set(publicationId);
                context.publishedRows = newPublishedRows;
                var oldHandle = context.handle;
                context.handle = newHandle;

                if (oldHandle) {
                    oldHandle.stop();
                }
            } else {
                // another handle was created after this one
                newHandle.stop();
            }
        };
        var onError = function (error) {
            console.log("ReactiveTable subscription error: " + error);
        };
        newHandle = Meteor.subscribe(
            "reactive-table-" + context.collection,
            publicationId,
            filter,
            context.fields,
            options,
            context.rowsPerPage.get(),
            {onReady: onReady, onError: onError}
        );
    }
}, 200);


var getDefaultFalseSetting = function (key, templateData) {
    if (!_.isUndefined(templateData[key]) &&
        templateData[key]) {
        return true;
    }
    if (!_.isUndefined(templateData.settings) &&
        !_.isUndefined(templateData.settings[key]) &&
        templateData.settings[key]) {
        return true;
    }
    return false;
};

var getDefaultTrueSetting = function (key, templateData) {
    if (!_.isUndefined(templateData[key]) &&
        !templateData[key]) {
        return false;
    }
    if (!_.isUndefined(templateData.settings) &&
        !_.isUndefined(templateData.settings[key]) &&
        !templateData.settings[key]) {
        return false;
    }
    return true;
};



var setup = function () {
    var context = {};
    var oldContext = this.context || {};
    context.templateData = this.data;
    this.data.settings = this.data.settings || {};
    var collection = this.data.collection || this.data.settings.collection || this.data;

    if (!(collection instanceof Mongo.Collection)) {
        if (_.isArray(collection)) {
            // collection is an array
            // create a new collection from the data
            var data = collection;
            collection = new Mongo.Collection(null);
            _.each(data, function (doc) {
                collection.insert(doc);
            });
        } else if (_.isFunction(collection.fetch)) {
            // collection is a cursor
            // create a new collection that will reactively update
            var cursor = collection;
            collection = new Mongo.Collection(null);

            // copy over transforms from collection-helper package
            collection._transform = cursor._transform;
            collection._name = cursor.collection._name;

            var addedCallback = function (doc) {
                collection.insert(doc);
            };
            var changedCallback = function (doc, oldDoc) {
                collection.update(oldDoc._id, doc);
            };
            var removedCallback = function (oldDoc) {
                collection.remove(oldDoc._id);
            };
            cursor.observe({added: addedCallback, changed: changedCallback, removed: removedCallback});
        } else if (_.isString(collection)) {
            // server side publication
            context.server = true;
            context.publicationId = new ReactiveVar();
            context.nextPublicationId = new ReactiveVar();
            context.publishedRows = new Mongo.Collection(null);
        } else {
            console.error("reactiveTable error: argument is not an instance of Mongo.Collection, a cursor, or an array");
            collection = new Mongo.Collection(null);
        }
    }
    context.collection = collection;

    var fields = this.data.fields || this.data.settings.fields || {};
    if (_.keys(fields).length < 1 ||
        (_.keys(fields).length === 1 &&
         _.keys(fields)[0] === 'hash')) {
        fields = _.without(_.keys(collection.findOne() || {}), '_id');
    }

    var fieldIdsArePresentAndUnique = function (fields) {
        var uniqueFieldIds = _.chain(fields)
            .filter(function (field) {
                return !_.isUndefined(field.fieldId)
            })
            .map(function (field) {
                return field.fieldId;
            })
            .uniq()
            .value();
        return uniqueFieldIds.length === fields.length;
    };

    // If at least one field specifies a fieldId, all fields must specify a 
    // fieldId with a unique value
    if (_.find(fields, function (field) {
        return !_.isUndefined(field.fieldId)
        }) && !fieldIdsArePresentAndUnique(fields)) {
        console.error("reactiveTable error: all fields must have a unique-valued fieldId if at least one has a fieldId attribute");
        fields = [];
    } 

    var sortKey = null;
    var sortDirection = 1;

    var normalizeField = function (field) {
        if (typeof field === 'string') {
            return {key: field, label: field};
        } else {
            return field;
        }
    };

    var parseField = function (field, i) {
        var normalizedField = normalizeField(field);
        if (!_.has(normalizedField, 'fieldId')) {
            // Default fieldId to index in fields array if not present
            normalizedField.fieldId = i.toString();
        }
        if (normalizedField.sort) {
            sortKey = normalizedField.fieldId;
            if (normalizedField.sort === 'desc' || normalizedField.sort === 'descending'  || normalizedField.sort === -1) {
                sortDirection = -1;
            }
        }
        return normalizedField;
    };

    fields = _.map(fields, parseField);
    if (!sortKey) {
        // Default to sort of first column
        sortKey = (fields[0]) ? fields[0].fieldId : null;
    }
    context.fields = fields;
    context.sortKey = !_.isUndefined(oldContext.sortKey) ? oldContext.sortKey : new ReactiveVar(sortKey);
    context.sortDirection = !_.isUndefined(oldContext.sortDirection) ? oldContext.sortDirection : new ReactiveVar(sortDirection);

    var visibleFields = [];
    _.each(fields, function (field, i) {
        visibleFields.push({fieldId:field.fieldId, isVisible:getDefaultFieldVisibility(field)});
    });
    context.visibleFields = (!_.isUndefined(oldContext.visibleFields) && !_.isEmpty(oldContext.visibleFields)) ? oldContext.visibleFields : new ReactiveVar(visibleFields);


    var rowClass = this.data.rowClass || this.data.settings.rowClass || function() {return ''};
    if (typeof rowClass === 'string') {
        var tmp = rowClass;
        rowClass = function(obj) { return tmp; };
    }
    context.rowClass = rowClass;

    context.class = this.data.class || this.data.settings.class || 'table table-striped table-hover col-sm-12';
    context.id = this.data.id || this.data.settings.id || _.uniqueId('reactive-table-');

    context.showNavigation = this.data.showNavigation || this.data.settings.showNavigation || 'always';
    context.showNavigationRowsPerPage = getDefaultTrueSetting('showNavigationRowsPerPage', this.data);
    context.rowsPerPage =  !_.isUndefined(oldContext.rowsPerPage) ? oldContext.rowsPerPage : new ReactiveVar(this.data.rowsPerPage || this.data.settings.rowsPerPage || 10);
    context.currentPage = !_.isUndefined(oldContext.currentPage) ? oldContext.currentPage : new ReactiveVar(0);

    context.filter = !_.isUndefined(oldContext.filter) ? oldContext.filter : new ReactiveVar(null);
    context.showFilter = getDefaultTrueSetting('showFilter', this.data);

    context.showColumnToggles = getDefaultFalseSetting('showColumnToggles', this.data);

    if (_.isUndefined(this.data.useFontAwesome)) {
        if (!_.isUndefined(this.data.settings.useFontAwesome)) {
            context.useFontAwesome = this.data.settings.useFontAwesome;
        } else if (!_.isUndefined(Package['fortawesome:fontawesome'])) {
            context.useFontAwesome = true;
        } else {
            context.useFontAwesome = false;
        }
    } else {
        context.useFontAwesome = this.data.useFontAwesome;
    }
    context.enableRegex = getDefaultFalseSetting('enableRegex', this.data);
    
    context.ready = new ReactiveVar(true);

    if (context.server) {
        context.ready.set(false);
        updateHandle.call(context);
    }

    context.reactiveTableSetup = true;

    this.context = context;
};

var getDefaultFieldVisibility = function (field) {
    return !field.hidden || (_.isFunction(field.hidden) && !field.hidden());
}

var getPageCount = function () {
    var count;
    var rowsPerPage = this.rowsPerPage.get();
    if (this.server) {
        count = ReactiveTableCounts.findOne(this.publicationId.get());
        return Math.ceil((count ? count.count : 0) / rowsPerPage);
    } else {
        var filterQuery = getFilterQuery(this.filter.get(), this.fields, {enableRegex: this.enableRegex});
        count = this.collection.find(filterQuery).count();
        return Math.ceil(count / rowsPerPage);
    }
};


Template.reactiveTable.helpers({

    'context': function () {
        if (!Template.instance().context ||
            !_.isEqual(this, Template.instance().context.templateData)) {
            setup.call(Template.instance());
        }
        return Template.instance().context;
    },

    'ready' : function () {
        return this.ready.get();
    },

    'getField': function (object) {
        var fn = this.fn || function (value) { return value; };
        var key = this.key || this;
        var value = get(object, key);
        return fn(value, object);
    },

    'getFieldIndex': function () {
        return _.indexOf(Template.parentData(1).fields, this);
    },

    'getFieldFieldId': function () {
        return this.fieldId;
    },

    'getKey': function () {
        return this.key || this;
    },

    'getHeaderClass': function () {
        if (!(this.headerClass)) {
            return '';
        }
        var css;
        if (_.isFunction(this.headerClass)) {
            css = this.headerClass();
        } else {
            css = this.headerClass;
        }
        return css;
    },

    'labelIsTemplate': function () {
        return this.label && _.isObject(this.label) && this.label instanceof Blaze.Template;
    },

    'getLabel': function () {
        return _.isString(this.label) ? this.label : this.label();
    },

    'isSortKey': function () {
        var parentData = Template.parentData(1);
        return parentData.sortKey.get() === this.fieldId;
    },

    'isSortable': function () {
        return (this.sortable == undefined) ? true : this.sortable;
    },

    'isVisible': function () {
        var self = this; // is a field object
        var topLevelData;
        if (Template.parentData(2) && Template.parentData(2).reactiveTableSetup) {
          topLevelData = Template.parentData(2);
        } else {
          topLevelData = Template.parentData(1);
        }
        var visibleFields = topLevelData.visibleFields.get();
        var fields = topLevelData.fields;

        var visibleField = _.findWhere(visibleFields, {fieldId: self.fieldId});
        if (visibleField) {
            return visibleField.isVisible;
        } else {
            // Add field to visibleFields list
            var _isVisible = getDefaultFieldVisibility(self);
            visibleFields.push({fieldId:self.fieldId, isVisible:_isVisible});
            topLevelData.visibleFields.set(visibleFields);
            return _isVisible;
        }
    },

    'isAscending' : function () {
        var sortDirection = Template.parentData(1).sortDirection.get();
        return (sortDirection === 1);
    },

    'sortedRows': function () {
        if (this.server) {
            return this.publishedRows.find({
              "reactive-table-id": this.publicationId.get()
            }, {
              sort: {
                "reactive-table-sort": 1
              }
            });
        } else  {
            var sortDirection = this.sortDirection.get();
            var sortKeyFieldId = this.sortKey.get();
            var sortKeyField = _.findWhere(this.fields, {fieldId: sortKeyFieldId});

            var limit = this.rowsPerPage.get();
            var currentPage = this.currentPage.get();
            var skip = currentPage * limit;
            var filterQuery = getFilterQuery(this.filter.get(), this.fields, {enableRegex: this.enableRegex});

            if (!sortKeyField) {
                // No sort field set, return unsorted collection
                return this.collection.find(filterQuery, {
                    skip: skip,
                    limit: limit
                }); 
            } else if (sortKeyField.fn && !sortKeyField.sortByValue) {
                var data = this.collection.find(filterQuery).fetch();
                var sorted =_.sortBy(data, function (object) {
                    return sortKeyField.fn(object[sortKeyField.key], object);
                });
                if (sortDirection === -1) {
                    sorted = sorted.reverse();
                }
                return sorted.slice(skip, skip + limit);
            } else {
                var sortKey = sortKeyField.key || sortKeyField;
                var sortQuery = {};
                sortQuery[sortKey] = sortDirection;

                return this.collection.find(filterQuery, {
                    sort: sortQuery,
                    skip: skip,
                    limit: limit
                });
            }
        }
    },

    'filter' : function () {
        return this.filter.get() || '';
    },

    'getPageCount' : getPageCount,

    'getRowsPerPage' : function () {
        return this.rowsPerPage.get();
    },

    'getCurrentPage' : function () {
        return 1 + this.currentPage.get();
    },

    'isntFirstPage' : function () {
        return this.currentPage.get() > 0;
    },

    'isntLastPage' : function () {
        var currentPage = 1 + this.currentPage.get();
        var pageCount = getPageCount.call(this);
        return currentPage < pageCount;
    },

    'showNavigation' : function () {
        if (this.showNavigation === 'always') return true;
        if (this.showNavigation === 'never') return false;
        return getPageCount.call(this) > 1;
    }
});

Template.reactiveTable.events({
    'click .reactive-table .sortable': function (event) {
        var template = Template.instance();
        var target = $(event.target).is('i') ? $(event.target).parent() : $(event.target);
        var sortFieldId = target.attr('fieldid');
        var currentSortFieldId = template.context.sortKey.get();
        if (currentSortFieldId === sortFieldId) {
            var sortDirection = -1 * template.context.sortDirection.get();
            template.context.sortDirection.set(sortDirection);
        } else {
            template.context.sortKey.set(sortFieldId);
        }
        updateHandle.call(template.context);
    },

    'change .reactive-table-columns-dropdown input': function (event) {
        var template = Template.instance();
        var target = $(event.target);
        var fieldId = target.attr('data-fieldid');
        var visibleFields = template.context.visibleFields.get();
        var visibleField = _.findWhere(visibleFields, {fieldId: fieldId});
        if (visibleField) {
            // Toggle visibility
            visibleField.isVisible = !visibleField.isVisible;
            template.context.visibleFields.set(visibleFields);
        }
    },

    'keyup .reactive-table-filter .reactive-table-input, input .reactive-table-filter .reactive-table-input': function (event) {
        var template = Template.instance();
        var filterText = $(event.target).val();
        updateFilter(template, filterText);
        updateHandle.call(template.context);
    },

    'change .reactive-table-navigation .rows-per-page input': function (event) {
        var rowsPerPage = Math.max(~~$(event.target).val(), 1);
        Template.instance().context.rowsPerPage.set(rowsPerPage);
        $(event.target).val(rowsPerPage);
        updateHandle.call(Template.instance().context);
    },

    'change .reactive-table-navigation .page-number input': function (event) {
        var currentPage = Math.max(~~$(event.target).val(), 1);
        var pageCount = getPageCount.call(this);
        if (currentPage > pageCount) {
          currentPage = pageCount;
        }
        if (currentPage < 0) {
          currentPage = 1;
        }
        Template.instance().context.currentPage.set(currentPage - 1);
        $(event.target).val(currentPage);
        updateHandle.call(Template.instance().context);
    },

    'click .reactive-table-navigation .previous-page': function (event) {
        var template = Template.instance();
        var currentPage = template.context.currentPage.get();
        template.context.currentPage.set(currentPage - 1);
        updateHandle.call(template.context);
    },

    'click .reactive-table-navigation .next-page': function (event) {
        var template = Template.instance();
        var currentPage = template.context.currentPage.get();
        template.context.currentPage.set(currentPage + 1);
        updateHandle.call(template.context);
    }
});
