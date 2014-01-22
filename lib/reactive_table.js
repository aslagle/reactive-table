var getSessionSortKey = function (identifier) {
    return identifier + '-reactive-table-sort';
};

var getSessionSortDirectionKey = function (identifier) {
    return identifier + '-reactive-table-sort-direction';
};

var getSessionRowsPerPageKey = function (identifier) {
    return identifier + '-reactive-table-rows-per-page';
};

var getSessionCurrentPageKey = function (identifier) {
    return identifier + '-reactive-table-current-page';
};


if (Handlebars) {
    Handlebars.registerHelper('reactiveTable', function (collection, fields, attrs) {
        if (!(collection instanceof Meteor.Collection)) {
            if (_.isFunction(collection.fetch) || _.isArray(collection)) {
                // collection is an array or a cursor
                // create a new collection from the data
                data = _.isArray(collection) ?  collection : collection.fetch();
                collection = new Meteor.Collection(null);
                _.each(data, function (doc) {
                    collection.insert(doc);
                });
            } else {
                console.log("reactiveTable error: argument is not an instance of Meteor.Collection, a cursor, or an array");
                return '';
            }
        } 

        if (collection.find().count() < 1) {
            return '';
        }
        if (_.keys(fields).length < 1 ||
                (_.keys(fields).length === 1 &&
                _.keys(fields)[0] === 'hash')) {
            fields = _.without(_.keys(collection.findOne()), '_id');
        }
        var identifier = collection._name + _.uniqueId();
        Session.setDefault(getSessionSortKey(identifier), fields[0].key || fields[0]);
        Session.setDefault(getSessionSortDirectionKey(identifier), 1);
        Session.setDefault(getSessionRowsPerPageKey(identifier), 10);
        Session.setDefault(getSessionCurrentPageKey(identifier), 0);
        var html = Template.reactiveTable({
                identifier: identifier,
                collection: collection,
                fields: fields,
                attrs: attrs
            });
        return new Handlebars.SafeString(html);
    });
}

Template.reactiveTable.helpers({
    "getField": function (object) {
        var fn = this.fn || function (value) { return value; };
        var key = this.key || this;
        var keys = key.split('.');
        var value = object;
        _.each(keys, function (key) {
            if (value && value[key]) {
                value = value[key];
            } else {
                value = null;
            }
        });
        return fn(value);
    },

    "getAttrs": function (attrs) {
        var attrStrings = _.map(attrs, function (attr, name) {
            return name + '=' + this[attr]
        }, this);
        return attrStrings.join(' ');
    },

    "getKey": function () {
        return this.key || this;
    },

    "getLabel": function () {
        return this.label || this;
    },

    "isSortKey": function (field, identifier) {
        return Session.equals(getSessionSortKey(identifier), field.key || field);
    },

    "isSortable": function () {
        return !this.fn;
    },

    "isAscending" : function (identifier) {
        var sortDirection = Session.get(getSessionSortDirectionKey(identifier));
        return (sortDirection === 1);
    },

    "sortedRows": function () {
        var sortKey = Session.get(getSessionSortKey(this.identifier));
        var sortDirection = Session.get(getSessionSortDirectionKey(this.identifier));
        var sortQuery = {};
        sortQuery[sortKey] = sortDirection;
        var limit = Session.get(getSessionRowsPerPageKey(this.identifier));
        var currentPage = Session.get(getSessionCurrentPageKey(this.identifier));
        var skip = currentPage * limit;
        return this.collection.find({}, {
            sort: sortQuery,
            skip: skip,
            limit: limit
        });
    },

    "getRowsPerPage" : function () {
        return Session.get(getSessionRowsPerPageKey(this.identifier));
    },

    "getCurrentPage" : function () {
        return 1 + Session.get(getSessionCurrentPageKey(this.identifier));
    },

    "isntFirstPage" : function () {
        return Session.get(getSessionCurrentPageKey(this.identifier)) > 0;
    },

    "isntLastPage" : function () {
        var currentPage = 1 + Session.get(getSessionCurrentPageKey(this.identifier));
        var rowsPerPage = Session.get(getSessionRowsPerPageKey(this.identifier));
        var count = this.collection.find().count();
        return currentPage < Math.ceil(count / rowsPerPage);
    },

    "getPageCount" : function () {
        var rowsPerPage = Session.get(getSessionRowsPerPageKey(this.identifier));
        var count = this.collection.find().count();
        return Math.ceil(count / rowsPerPage);
    }
});

Template.reactiveTable.events({
    "click .reactive-table .sortable": function (event) {
        var sortKey = $(event.target).attr("key");
        var identifier = $(event.target).parents('.reactive-table').attr('reactive-table-id');
        var currentSortKey = Session.get(getSessionSortKey(identifier));
        if (currentSortKey === sortKey) {
            var sortDirection = -1 * Session.get(getSessionSortDirectionKey(identifier));
            Session.set(getSessionSortDirectionKey(identifier), sortDirection);
        } else {
            Session.set(getSessionSortKey(identifier), sortKey);
        }
    },

    "change .reactive-table-navigation .rows-per-page input": function (event) {
        try {
            var rowsPerPage = parseInt($(event.target).val(), 10);
            var identifier = $(event.target).parents('.reactive-table-navigation').attr('reactive-table-id');
            Session.set(getSessionRowsPerPageKey(identifier), rowsPerPage);
        } catch (e) {
            console.log("rows per page must be an integer");
        }
    },

    "change .reactive-table-navigation .current-page input": function (event) {
        try {
            var currentPage = parseInt($(event.target).val(), 10) - 1;
            var identifier = $(event.target).parents('.reactive-table-navigation').attr('reactive-table-id');
            Session.set(getSessionCurrentPageKey(identifier), currentPage);
        } catch (e) {
            console.log("current page must be an integer");
        }
    },

    "click .reactive-table-navigation .previous-page": function (event) {
        var identifier = $(event.target).parents('.reactive-table-navigation').attr('reactive-table-id');
        var currentPageKey = getSessionCurrentPageKey(identifier);
        var currentPage = Session.get(currentPageKey);
        Session.set(currentPageKey, currentPage - 1);
    },

    "click .reactive-table-navigation .next-page": function (event) {
        var identifier = $(event.target).parents('.reactive-table-navigation').attr('reactive-table-id');
        var currentPageKey = getSessionCurrentPageKey(identifier);
        var currentPage = Session.get(currentPageKey);
        Session.set(currentPageKey, currentPage + 1);
    }
});
