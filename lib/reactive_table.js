var getSessionSortKey = function (id) {
    return id + '-reactive-table-sort';
};

var getSessionSortDirectionKey = function (id) {
    return id + '-reactive-table-sort-direction';
};

var getSessionRowsPerPageKey = function (id) {
    return id + '-reactive-table-rows-per-page';
};

var getSessionCurrentPageKey = function (id) {
    return id + '-reactive-table-current-page';
};

var getSessionFilterKey = function (id) {
    return id + '-reactive-table-filter';
};



var generateSettings =  function () {
    var id = _.uniqueId('reactive-table');
    var collection = this.collection || this;
    var settings = this.settings || {};
    if (!(collection instanceof Meteor.Collection)) {
        if (_.isFunction(collection.fetch) || _.isArray(collection)) {
            // collection is an array or a cursor
            // create a new collection from the data
            var data = _.isArray(collection) ?  collection : collection.fetch();
            collection = new Meteor.Collection(null);
            _.each(data, function (doc) {
                collection.insert(doc);
            });
        } else {
            console.log("reactiveTable error: argument is not an instance of Meteor.Collection, a cursor, or an array");
            collection = new Meteor.Collection(null);
        }
    } 

    var fields = settings.fields || {};
    if (_.keys(fields).length < 1 ||
        (_.keys(fields).length === 1 &&
         _.keys(fields)[0] === 'hash')) {
        fields = _.without(_.keys(collection.findOne()), '_id');
    }

    var normalizeField = function (field) {
        if (typeof field === 'string') {
            return {key: field, label: field};
        } else {
            return field;
        }
    };
    fields = _.map(fields, normalizeField);

    Session.setDefault(getSessionSortKey(id), 0);
    Session.setDefault(getSessionSortDirectionKey(id), 1);
    Session.setDefault(getSessionRowsPerPageKey(id), settings.rowsPerPage || 10);
    Session.setDefault(getSessionCurrentPageKey(id), 0);
    Session.setDefault(getSessionFilterKey(id), null);
    var showFilter = (typeof settings.showFilter === "undefined" ? true : settings.showFilter);

    return {
        id: id,
        collection: collection,
        settings: settings,
        fields: fields,
        showFilter: showFilter
    };
};

var parseFilterString = function (filterString) {
    var startQuoteRegExp = /^[\'\"]/;
    var endQuoteRegExp = /[\'\"]$/;
    var filters = [];
    var words = filterString.split(" ");

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

var getFilterQuery = function (id, fields) {
    var filter = Session.get(getSessionFilterKey(id));
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
            });
            if (filterQueryList.length) {
                var filterQuery = {'$or': filterQueryList};
                queryList.push(filterQuery);
            }
        });
    }
    return queryList.length ? {'$and': queryList} : {};
};

Template.reactiveTable.helpers({
    "generateSettings": generateSettings,

    "getField": function (object) {
        var fn = this.fn || function (value) { return value; };
        var key = this.key || this;
        var keys = key.split('.');
        var value = object;
        _.each(keys, function (key) {
            if (!_.isUndefined(value) && !_.isUndefined(value[key])) {
                value = value[key];
            } else {
                value = null;
            }
        });
        return fn(value, object);
    },

    "getFieldIndex": function (fields) {
        return _.indexOf(fields, this);
    },

    "getKey": function () {
        return this.key || this;
    },

    "getLabel": function () {
        return this.label || this;
    },

    "isSortKey": function (field, id, fields) {
        return Session.equals(getSessionSortKey(id), _.indexOf(fields, field));
    },

    "isSortable": function () {
        return true;
    },

    "isAscending" : function (id) {
        var sortDirection = Session.get(getSessionSortDirectionKey(id));
        return (sortDirection === 1);
    },

    "sortedRows": function () {
        var sortDirection = Session.get(getSessionSortDirectionKey(this.id));
        var sortKeyIndex = Session.get(getSessionSortKey(this.id));
        var sortKeyField = this.fields[sortKeyIndex];

        var limit = Session.get(getSessionRowsPerPageKey(this.id));
        var currentPage = Session.get(getSessionCurrentPageKey(this.id));
        var skip = currentPage * limit;
        var filterQuery = getFilterQuery(this.id, this.fields);

        if (sortKeyField.fn) {
            var data = this.collection.find(filterQuery, {
                sort: sortQuery
            }).fetch();
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

    "filter" : function () {
        return Session.get(getSessionFilterKey(this.id)) || '';
    },

    "getRowsPerPage" : function () {
        return Session.get(getSessionRowsPerPageKey(this.id));
    },

    "getCurrentPage" : function () {
        return 1 + Session.get(getSessionCurrentPageKey(this.id));
    },

    "isntFirstPage" : function () {
        return Session.get(getSessionCurrentPageKey(this.id)) > 0;
    },

    "isntLastPage" : function () {
        var currentPage = 1 + Session.get(getSessionCurrentPageKey(this.id));
        var rowsPerPage = Session.get(getSessionRowsPerPageKey(this.id));
        var filterQuery = getFilterQuery(this.id, this.fields);
        var count = this.collection.find(filterQuery).count();
        return currentPage < Math.ceil(count / rowsPerPage);
    },

    "getPageCount" : function () {
        var rowsPerPage = Session.get(getSessionRowsPerPageKey(this.id));
        var filterQuery = getFilterQuery(this.id, this.fields);
        var count = this.collection.find(filterQuery).count();
        return Math.ceil(count / rowsPerPage);
    }
});

Template.reactiveTable.events({
    "click .reactive-table .sortable": function (event) {
        var sortIndex = parseInt($(event.target).attr("index"), 10);
        var id = $(event.target).parents('.reactive-table').attr('reactive-table-id');
        var currentSortIndex = Session.get(getSessionSortKey(id));
        if (currentSortIndex === sortIndex) {
            var sortDirection = -1 * Session.get(getSessionSortDirectionKey(id));
            Session.set(getSessionSortDirectionKey(id), sortDirection);
        } else {
            Session.set(getSessionSortKey(id), sortIndex);
        }
    },

    "keyup .reactive-table-filter input": function (event) {
        var filterText = $(event.target).val();
        var id = $(event.target).parents('.reactive-table-filter').attr('reactive-table-id');
        Session.set(getSessionFilterKey(id), filterText);
        Session.set(getSessionCurrentPageKey(this.id), 0);
    },

    "change .reactive-table-navigation .rows-per-page input": function (event) {
        try {
            var rowsPerPage = parseInt($(event.target).val(), 10);
            var id = $(event.target).parents('.reactive-table-navigation').attr('reactive-table-id');
            Session.set(getSessionRowsPerPageKey(id), rowsPerPage);
        } catch (e) {
            console.log("rows per page must be an integer");
        }
    },

    "change .reactive-table-navigation .page-number input": function (event) {
        try {
            var currentPage = parseInt($(event.target).val(), 10) - 1;
            var id = $(event.target).parents('.reactive-table-navigation').attr('reactive-table-id');
            Session.set(getSessionCurrentPageKey(id), currentPage);
        } catch (e) {
            console.log("current page must be an integer");
        }
    },

    "click .reactive-table-navigation .previous-page": function (event) {
        var id = $(event.target).parents('.reactive-table-navigation').attr('reactive-table-id');
        var currentPageKey = getSessionCurrentPageKey(id);
        var currentPage = Session.get(currentPageKey);
        Session.set(currentPageKey, currentPage - 1);
    },

    "click .reactive-table-navigation .next-page": function (event) {
        var id = $(event.target).parents('.reactive-table-navigation').attr('reactive-table-id');
        var currentPageKey = getSessionCurrentPageKey(id);
        var currentPage = Session.get(currentPageKey);
        Session.set(currentPageKey, currentPage + 1);
    }
});
