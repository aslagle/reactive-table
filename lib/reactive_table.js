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


var parseFilterString = function (filterString) {
    var startQuoteRegExp = /^[\'\"]/;
    var endQuoteRegExp = /[\'\"]$/;
    var filters = [];
    var words = filterString.split(' ');

    var inQuote = false;
    var quotedWord = '';
    _.each(words, function (word) {
        if (inQuote) {
            if (endQuoteRegExp.test(word)) {
                filters.push(quotedWord + ' ' + word.slice(0, word.length - 1));
                inQuote = false;
                quotedWord = '';
            } else {
                quotedWord = quotedWord + ' ' + word;
            }
        } else if (startQuoteRegExp.test(word)) {
            if (endQuoteRegExp.test(word)) {
                filters.push(word.slice(1, word.length - 1));
            } else {
                inQuote = true;
                quotedWord = word.slice(1, word.length);
            }
        } else {
            filters.push(word);
        }
    });
    return filters;
};

var getFilterQuery = function (filter, fields) {
    var numberRegExp = /^\d+$/;
    var queryList = [];
    if (filter) {
        var filters = parseFilterString(filter);
        _.each(filters, function (filterWord) {
            var filterQueryList = [];
            _.each(fields, function (field) {
                var filterRegExp = new RegExp(filterWord, 'i');
                var query = {};
                query[field.key || field] = filterRegExp;
                filterQueryList.push(query);

                if (numberRegExp.test(filterWord)) {
                    var numberQuery = {};
                    numberQuery[field.key || field] = parseInt(filterWord, 10);
                    filterQueryList.push(numberQuery)
                }
            });
            if (filterQueryList.length) {
                var filterQuery = {'$or': filterQueryList};
                queryList.push(filterQuery);
            }
        });
    }
    return queryList.length ? {'$and': queryList} : {};
};

var updateFilter = _.debounce(function (template, filterText) {
    template.data.filter.set(filterText);
    template.data.currentPage.set(0);
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
    this.data.settings = this.data.settings || {};
    var collection = this.data.collection || this.data.settings.collection || this.data;

    if (!(collection instanceof Meteor.Collection)) {
        if (_.isArray(collection)) {
            // collection is an array
            // create a new collection from the data
            var data = collection;
            collection = new Meteor.Collection(null);
            _.each(data, function (doc) {
                collection.insert(doc);
            });
        } else if (_.isFunction(collection.fetch)) {
            // collection is a cursor
            // create a new collection that will reactively update
            var cursor = collection;
            collection = new Meteor.Collection(null);
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
        } else {
            console.log("reactiveTable error: argument is not an instance of Meteor.Collection, a cursor, or an array");
            collection = new Meteor.Collection(null);
        }
    }
    this.data.collection = collection;

    var fields = this.data.fields || this.data.settings.fields || {};
    if (_.keys(fields).length < 1 ||
        (_.keys(fields).length === 1 &&
         _.keys(fields)[0] === 'hash')) {
        fields = _.without(_.keys(collection.findOne() || {}), '_id');
    }

    var sortKey = 0;
    var sortDirection = 1;

    var normalizeField = function (field) {
        if (typeof field === 'string') {
            return {key: field, label: field};
        } else {
            return field;
        }
    };

    var parseField = function (field, i) {
        if (field.sort) {
            sortKey = i;
            if (field.sort === 'desc' || field.sort === 'descending'  || field.sort === -1) {
                sortDirection = -1;
            }
        }
        return normalizeField(field);
    };

    fields = _.map(fields, parseField);
    this.data.fields = fields;
    this.data.sortKey = new ReactiveVar(sortKey);
    this.data.sortDirection = new ReactiveVar(sortDirection);

    var visibleFields = [];
    _.each(fields, function (field, i) {
        if (!field.hidden || (_.isFunction(field.hidden) && !field.hidden())) {
          visibleFields.push(i);
        }
    });
    this.data.visibleFields = new ReactiveVar(visibleFields);


    var rowClass = this.data.rowClass || this.data.settings.rowClass || function() {return ''};
    if (typeof rowClass === 'string') {
        var tmp = rowClass;
        rowClass = function(obj) { return tmp; };
    }
    this.data.rowClass = rowClass;

    this.data.class = this.data.class || this.data.settings.class || 'table table-striped table-hover';
    this.data.id = this.data.id || this.data.settings.id || _.uniqueId('reactive-table-');

    this.data.showNavigation = this.data.showNavigation || this.data.settings.showNavigation || 'always';
    this.data.showNavigationRowsPerPage = getDefaultTrueSetting('showNavigationRowsPerPage', this.data);
    this.data.rowsPerPage = new ReactiveVar(this.data.rowsPerPage || this.data.settings.rowsPerPage || 10);
    this.data.currentPage = new ReactiveVar(0);

    this.data.filter = new ReactiveVar(null);
    this.data.showFilter = getDefaultTrueSetting('showFilter', this.data);

    this.data.useFontAwesome = getDefaultFalseSetting('useFontAwesome', this.data);
    this.data.showColumnToggles = getDefaultFalseSetting('showColumnToggles', this.data);
    this.data.reactiveTableSetup = true;
};

Template.reactiveTable.created = setup;
Template.reactiveTable.rendered = function () {
    if (!this.data.reactiveTableSetup) {
        setup.call(this);
    }
};

var getPageCount = function () {
    var rowsPerPage = this.rowsPerPage.get();
    var filterQuery = getFilterQuery(this.filter.get(), this.fields);
    var count = this.collection.find(filterQuery).count();
    return Math.ceil(count / rowsPerPage);
};


Template.reactiveTable.helpers({

    'setup' : function () {
        if (!this.reactiveTableSetup) {
            setup.call(Template.instance());
        }
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

    'getKey': function () {
        return this.key || this;
    },

    'getLabel': function () {
        return _.isString(this.label) ? this.label : this;
    },

    'isSortKey': function () {
        var parentData = Template.parentData(1);
        return parentData.sortKey.get() == _.indexOf(parentData.fields, this);
    },

    'isSortable': function () {
        return true;
    },

    'isVisible': function () {
        var topLevelData;
        if (Template.parentData(2) && Template.parentData(2).reactiveTableSetup) {
          topLevelData = Template.parentData(2);
        } else {
          topLevelData = Template.parentData(1);
        }
        var visibleFields = topLevelData.visibleFields;
        var fields = topLevelData.fields;
        return _.include(visibleFields.get(), _.indexOf(fields, this));
    },

    'isAscending' : function () {
        var sortDirection = Template.parentData(1).sortDirection.get();
        return (sortDirection === 1);
    },

    'sortedRows': function () {
        var sortDirection = this.sortDirection.get();
        var sortKeyIndex = this.sortKey.get();
        var sortKeyField = this.fields[sortKeyIndex] || {};

        var limit = this.rowsPerPage.get();
        var currentPage = this.currentPage.get();
        var skip = currentPage * limit;
        var filterQuery = getFilterQuery(this.filter.get(), this.fields);

        if (sortKeyField.fn && !sortKeyField.sortByValue) {
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
        var rowsPerPage = this.rowsPerPage.get();
        var filterQuery = getFilterQuery(this.filter.get(), this.fields);
        var count = this.collection.find(filterQuery).count();
        return currentPage < Math.ceil(count / rowsPerPage);
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
        var sortIndex = parseInt(target.attr('index'), 10);
        var currentSortIndex = template.data.sortKey.get();
        if (currentSortIndex === sortIndex) {
            var sortDirection = -1 * template.data.sortDirection.get();
            template.data.sortDirection.set(sortDirection);
        } else {
            template.data.sortKey.set(sortIndex);
        }
    },

    'change .reactive-table-add-column input': function (event) {
        var template = Template.instance();
        var target = $(event.target);
        var index = parseInt(target.attr('index'), 10);
        var currentVisibleFields = template.data.visibleFields.get()
        if (_.include(currentVisibleFields, index)) {
            template.data.visibleFields.set(_.without(currentVisibleFields, index));
        } else {
            template.data.visibleFields.set(currentVisibleFields.concat(index));
        }
    },

    'keyup .reactive-table-filter .reactive-table-input, input .reactive-table-filter .reactive-table-input': function (event) {
        var template = Template.instance();
        var filterText = $(event.target).val();
        updateFilter(template, filterText);
    },

    'change .reactive-table-navigation .rows-per-page input': function (event) {
        var rowsPerPage = Math.max(~~$(event.target).val(), 1);
        Template.instance().data.rowsPerPage.set(rowsPerPage);
        $(event.target).val(rowsPerPage);
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
        Template.instance().data.currentPage.set(currentPage - 1);
        $(event.target).val(currentPage);
    },

    'click .reactive-table-navigation .previous-page': function (event) {
        var template = Template.instance();
        var currentPage = template.data.currentPage.get();
        template.data.currentPage.set(currentPage - 1);
    },

    'click .reactive-table-navigation .next-page': function (event) {
        var template = Template.instance();
        var currentPage = template.data.currentPage.get();
        template.data.currentPage.set(currentPage + 1);
    }
});
