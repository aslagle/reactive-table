var ReactiveTableCounts = new Mongo.Collection("reactive-table-counts");

var currentContext = new ReactiveVar(undefined)

get = function(obj, field) {
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

var updateHandle = function (set_context) {
    var context = set_context;
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
            limit: rowsPerPage,
            sort: getSortQuery(context.fields, context.multiColumnSort)
        };

        var filters = context.filters.get();

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
            getFilterStrings(filters),
            getFilterFields(filters, context.fields),
            options,
            context.rowsPerPage.get(),
            {onReady: onReady, onError: onError}
        );
    }
};


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

    context.multiColumnSort = getDefaultTrueSetting('multiColumnSort', this.data);

    var fields = this.data.fields || this.data.settings.fields || {};
    if (_.keys(fields).length < 1 ||
        (_.keys(fields).length === 1 &&
         _.keys(fields)[0] === 'hash')) {

        if (context.server) {
            console.error("reactiveTable error: fields option is required with server-side publications");
        } else {
            fields = _.without(_.keys(collection.findOne() || {}), '_id');
            if (fields.length < 1) {
                console.error("reactiveTable error: Couldn't get fields from an item in the collection on load, so there are no columns to display. Provide the fields option or ensure that the collection has at least one item and the subscription is ready when the table renders.");
            }
        }
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

    var normalizeField = function (field, i) {
        if (typeof field === 'string') {
            field = {key: field, label: field};
        }
        if (!_.has(field, 'fieldId')) {
            // Default fieldId to index in fields array if not present
            field.fieldId = i.toString();
        }
        if (!_.has(field, 'key')) {
            field.key = '';
        }
        oldField = _.find(oldContext.fields, function (oldField) {
            return oldField.fieldId === field.fieldId;
        });
        normalizeSort(field, oldField);
        return field;
    };

    fields = _.map(fields, normalizeField);

    context.fields = fields;

    var visibleFields = [];
    _.each(fields, function (field, i) {
        visibleFields.push({fieldId:field.fieldId, isVisible: getDefaultFieldVisibility(field)});
    });
    context.visibleFields = (!_.isUndefined(oldContext.visibleFields) && !_.isEmpty(oldContext.visibleFields)) ? oldContext.visibleFields : new ReactiveVar(visibleFields);


    var rowClass = this.data.rowClass || this.data.settings.rowClass || function() {return '';};
    if (typeof rowClass === 'string') {
        var tmp = rowClass;
        rowClass = function(obj) { return tmp; };
    }
    context.rowClass = rowClass;

    context.class = this.data.class || this.data.settings.class || 'table table-striped table-hover col-sm-12';
    context.id = this.data.id || this.data.settings.id || _.uniqueId('reactive-table-');

    context.showNavigation = this.data.showNavigation || this.data.settings.showNavigation || 'always';
    context.showNavigationRowsPerPage = getDefaultTrueSetting('showNavigationRowsPerPage', this.data);
    context.showRowCount = getDefaultFalseSetting('showRowCount', this.data)

    var rowsPerPage;
    if (!_.isUndefined(oldContext.rowsPerPage)) {
        rowsPerPage = oldContext.rowsPerPage;
    } else if (this.data.rowsPerPage && this.data.rowsPerPage instanceof ReactiveVar) {
        rowsPerPage = this.data.rowsPerPage;
    } else if (this.data.settings.rowsPerPage && this.data.settings.rowsPerPage instanceof ReactiveVar) {
        rowsPerPage = this.data.settings.rowsPerPage;
    } else {
        rowsPerPage = new ReactiveVar(this.data.rowsPerPage || this.data.settings.rowsPerPage || 10);
    }
    context.rowsPerPage = rowsPerPage;

    var currentPage;
    if (!_.isUndefined(oldContext.currentPage)) {
        currentPage = oldContext.currentPage;
    } else if (this.data.currentPage && this.data.currentPage instanceof ReactiveVar) {
        currentPage = this.data.currentPage;
    } else if (this.data.settings.currentPage && this.data.settings.currentPage instanceof ReactiveVar) {
        currentPage = this.data.settings.currentPage;
    } else {
        currentPage = new ReactiveVar(0);
    }
    context.currentPage = currentPage;

    var filters = this.data.filters || this.data.settings.filters || [];
    if (_.isEmpty(filters)) {
      context.showFilter = getDefaultTrueSetting('showFilter', this.data);
    } else {
      context.showFilter = getDefaultFalseSetting('showFilter', this.data);
    }
    if (context.showFilter) {
      filters.push(context.id + '-filter');
    }
    context.filters = new ReactiveVar(filters);

    dependOnFilters(context.filters.get(), function () {
      if (context.reactiveTableSetup) {
        context.currentPage.set(0);
        updateHandle(context);
      }
    });

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
    context.noDataTmpl = this.data.noDataTmpl || this.data.settings.noDataTmpl;
    context.enableRegex = getDefaultFalseSetting('enableRegex', this.data);
    context.filterOperator = this.data.filterOperator || this.data.settings.filterOperator || '$and';

    var ready;
    if (!_.isUndefined(oldContext.ready)) {
        ready = oldContext.ready;
    } else if (this.data.ready && this.data.ready instanceof ReactiveVar) {
        ready = this.data.ready;
    } else if (this.data.settings.ready && this.data.settings.ready instanceof ReactiveVar) {
        ready = this.data.settings.ready;
    } else {
        ready = new ReactiveVar(true);
    }
    context.ready = ready;

    if (context.server) {
        context.ready.set(false);
        updateHandle(context);
    }

    context.reactiveTableSetup = true;

    this.context = context;
    currentContext.set(this);
};

var getDefaultFieldVisibility = function (field) {
    if (field.isVisible && field.isVisible instanceof ReactiveVar) {
        return field.isVisible;
    }
    return new ReactiveVar(!field.hidden || (_.isFunction(field.hidden) && !field.hidden()));
}

var getRowCount = function () {
    if (this.server) {
        var count = ReactiveTableCounts.findOne(this.publicationId.get());
        return (count ? count.count : 0);
    } else {
        var filterQuery = getFilterQuery(getFilterStrings(this.filters.get()), getFilterFields(this.filters.get(), this.fields), {enableRegex: this.enableRegex, filterOperator: this.filterOperator});
        return this.collection.find(filterQuery).count();
    }
};

var getPageCount = function () {
    var count = getRowCount.call(this);
    var rowsPerPage = this.rowsPerPage.get();
    return Math.ceil(count / rowsPerPage);
};

/**
 * Note: I included TemplateController, to have a state var, because in the html, I could
 * not access async #let to manage a promise. Therefore, I put the old helper logic of
 * sortedRows into an autorun and also included the old onCreated logic.
 * Finally, the html does not recognise the state var, so that I created a helper passing the state var,
 * this works.
 */
TemplateController('reactiveTable', {
    state: {
        sortedRows: [],
        currentRows: [],
    },
    onCreated() {
        this.updateHandle = _.debounce(updateHandle, 200);

        var rowsPerPage = this.data.rowsPerPage || (this.data.settings && this.data.settings.rowsPerPage);
        var currentPage = this.data.currentPage || (this.data.settings && this.data.settings.currentPage);
        var fields = this.data.fields || (this.data.settings && this.data.settings.fields) || [];

        /**
         * Pass a function(returnContext){} to the {{> ReactiveTable contextFn=functionHelper}}
         * and set the context over the parameter.
         */
        typeof this.data.contextFn === 'function' && this.data.contextFn(this)

        var template = this;
        Tracker.autorun(function(c) {
            if (rowsPerPage instanceof ReactiveVar) {
                rowsPerPage.dep.depend();
            }
            if (currentPage instanceof ReactiveVar) {
                currentPage.dep.depend();
            }
            _.each(fields, function (field) {
                if (field.sortOrder && field.sortOrder instanceof ReactiveVar) {
                    field.sortOrder.dep.depend();
                }
                if (field.sortDirection && field.sortDirection instanceof ReactiveVar) {
                    field.sortDirection.dep.depend();
                }
            });
            if (template.context) {
                template.updateHandle(template.context);
            }
        });

        this.autorun(async (c) => {
            if (!currentContext.get())  {
                return
            }

            const {context} = currentContext.get();

            if (context.server) {
                var sortedRows = this.publishedRows.find({
                    "reactive-table-id": this.publicationId.get()
                }, {
                    sort: {
                        "reactive-table-sort": 1
                    }
                }).fetch();
                this.state.currentRows = sortedRows
                return sortedRows;
            } else {
                var sortByValue = _.all(getSortedFields(context.fields, context.multiColumnSort), function (field) {
                    return field.sortByValue || (!field.fn && !field.sortFn);
                });
                var filterQuery = getFilterQuery(getFilterStrings(context.filters.get()), getFilterFields(context.filters.get(), context.fields), {
                    enableRegex: context.enableRegex,
                    filterOperator: context.filterOperator
                });

                var limit = context.rowsPerPage.get();
                var currentPage = context.currentPage.get();
                var skip = currentPage * limit;

                if (sortByValue) {

                    var sortQuery = getSortQuery(context.fields, context.multiColumnSort);
                    var sortedRows = context.collection.find(filterQuery, {
                        sort: sortQuery,
                        skip: skip,
                        limit: limit
                    }).fetch();

                    this.state.currentRows = sortedRows
                    this.state.sortedRows = sortedRows;
                } else {
                    var rows = context.collection.find(filterQuery).fetch();
                    var sortedRows = await Tracker.withComputation(c, async () => await sortWithFunctions(rows, context.fields, context.multiColumnSort));
                    sortedRows = sortedRows.slice(skip, skip + limit);
                    this.state.currentRows = sortedRows
                    this.state.sortedRows = sortedRows;
                }
            }
        })
    }, helpers: {
        sortedRows() {
            return this.state.sortedRows
        },
    },
})

Template.reactiveTable.onDestroyed(function() {
  if (this.context.server && this.context.handle) {
    this.context.handle.stop();
  }
});

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

    'getFilterId': function () {
        return this.id + '-filter';
    },

    'getField': function (object) {
        var fn = this.fn || function (value) { return value; };
        var key = this.key;
        var value = get(object, key);
        return fn(value, object, key);
    },

    'getFieldIndex': function () {
        return _.indexOf(Template.parentData(1).fields, this);
    },

    'getFieldFieldId': function () {
        return this.fieldId;
    },

    'getKey': function () {
        return this.key;
    },

    'getHeaderClass': function () {
        if (_.isUndefined(this.headerClass)) {
            return this.key;
        }
        var css;
        if (_.isFunction(this.headerClass)) {
            css = this.headerClass();
        } else {
            css = this.headerClass;
        }
        return css;
    },

    'getCellClass': function (object) {
        if (_.isUndefined(this.cellClass)) {
            return this.key;
        }
        var css;
        if (_.isFunction(this.cellClass)) {
            var value = get(object, this.key);
            css = this.cellClass(value, object);
        } else {
            css = this.cellClass;
        }
        return css;
    },

    'labelIsTemplate': function () {
        return this.label && _.isObject(this.label) && this.label instanceof Blaze.Template;
    },

    'getLabel': function () {
        return _.isString(this.label) ? this.label : this.label();
    },

    'isPrimarySortField': function () {
        var parentData = Template.parentData(1);
        var primarySortField = getPrimarySortField(parentData.fields, parentData.multiColumnSort);
        return primarySortField && primarySortField.fieldId === this.fieldId;
    },

    'isSortable': function () {
        return (this.sortable === undefined) ? true : this.sortable;
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
            return visibleField.isVisible.get();
        } else {
            // Add field to visibleFields list
            var _isVisible = getDefaultFieldVisibility(self);
            visibleFields.push({fieldId:self.fieldId, isVisible:_isVisible});
            topLevelData.visibleFields.set(visibleFields);
            return _isVisible.get();
        }
    },

    'isAscending' : function () {
        var sortDirection = this.sortDirection.get();
        return (sortDirection === 1);
    },

    'noData': function () {
        var pageCount = getPageCount.call(this);
        return (pageCount === 0) && this.noDataTmpl;
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
    },
    'getRowCount': getRowCount
});

Template.reactiveTable.events({
    'click .reactive-table .sortable': function (event) {
        var template = Template.instance();
        var target = $(event.currentTarget);
        var sortFieldId = target.attr('fieldid');
        changePrimarySort(sortFieldId, template.context.fields, template.multiColumnSort);
        template.updateHandle(template.context);
    },

    'click .reactive-table-columns-dropdown li': function (event) {
        var template = Template.instance();
        var target = $(event.currentTarget);
        var fieldId = target.find('input').attr('data-fieldid');
        var visibleFields = template.context.visibleFields.get();
        var visibleField = _.findWhere(visibleFields, {fieldId: fieldId});
        if (visibleField) {
            // Toggle visibility
            visibleField.isVisible.set(!visibleField.isVisible.get());
            template.context.visibleFields.set(visibleFields);
        }
    },

    'change .reactive-table-navigation .rows-per-page input': function (event) {
        var rowsPerPage = Math.max(~~$(event.target).val(), 1);
        var template = Template.instance();
        template.context.rowsPerPage.set(rowsPerPage);
        $(event.target).val(rowsPerPage);

        var currentPage = template.context.currentPage.get() + 1;
        var pageCount = getPageCount.call(this);
        if (currentPage > pageCount) {
          template.context.currentPage.set(pageCount - 1);
        }
        template.updateHandle(template.context);
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
        var template = Template.instance();
        template.context.currentPage.set(currentPage - 1);
        $(event.target).val(currentPage);
        template.updateHandle(template.context);
    },

    'click .reactive-table-navigation .previous-page': function (event) {
        var template = Template.instance();
        var currentPage = template.context.currentPage.get();
        template.context.currentPage.set(currentPage - 1);
        template.updateHandle(template.context);
    },

    'click .reactive-table-navigation .next-page': function (event) {
        var template = Template.instance();
        var currentPage = template.context.currentPage.get();
        template.context.currentPage.set(currentPage + 1);
        template.updateHandle(template.context);
    }
});
