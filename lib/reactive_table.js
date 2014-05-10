var getSessionSortKey = function (group) {
    return group + '-reactive-table-sort';
};

var getSessionSortDirectionKey = function (group) {
    return group + '-reactive-table-sort-direction';
};

var getSessionRowsPerPageKey = function (group) {
    return group + '-reactive-table-rows-per-page';
};

var getSessionCurrentPageKey = function (group) {
    return group + '-reactive-table-current-page';
};

var getSessionFilterKey = function (group) {
    return group + '-reactive-table-filter';
};

var getSessionShowNavigationKey = function (group) {
    return group + '-reactive-table-show-navigation';
};



var generateSettings =  function () {
    var collection = this.collection || this;
    var settings = this.settings || {};
    var group = settings.group || 'reactive-table';
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

    var fields = settings.fields || {};
    if (_.keys(fields).length < 1 ||
        (_.keys(fields).length === 1 &&
         _.keys(fields)[0] === 'hash')) {
        fields = _.without(_.keys(collection.findOne() || {}), '_id');
    }

    var normalizeField = function (field) {
        if (typeof field === 'string') {
            return {key: field, label: field};
        } else {
            return field;
        }
    };
    fields = _.map(fields, normalizeField);

    Session.setDefault(getSessionSortKey(group), 0);
    Session.setDefault(getSessionSortDirectionKey(group), 1);
    Session.setDefault(getSessionRowsPerPageKey(group), settings.rowsPerPage || 10);
    Session.setDefault(getSessionCurrentPageKey(group), 0);
    Session.setDefault(getSessionShowNavigationKey(group), settings.showNavigation || 'always');
    Session.setDefault(getSessionFilterKey(group), null);
    var showFilter = (typeof settings.showFilter === "undefined" ? true : settings.showFilter);

    return {
        group: group,
        collection: collection,
        settings: settings,
        fields: fields,
        useFontAwesome: settings.useFontAwesome,
        showFilter: showFilter
    };
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

var getFilterQuery = function (group, fields) {
    var filter = Session.get(getSessionFilterKey(group));
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


Template.reactiveTable.getPageCount = function () {
    var rowsPerPage = Session.get(getSessionRowsPerPageKey(this.group));
    var filterQuery = getFilterQuery(this.group, this.fields);
    var count = this.collection.find(filterQuery).count();
    return Math.ceil(count / rowsPerPage);
};

var getValueFromKeyString = function(keyString, value){
    var keys = keyString.split('.');
    _.each(keys, function (key) {
        if (!_.isUndefined(value) && !_.isUndefined(value[key])) {
            value = value[key];
        } else {
            value = null;
        }
    });
    return value;
}

Template.reactiveTable.helpers({
    'generateSettings': generateSettings,

    'getField': function (object) {
        var fn = this.fn || function (value) { return value; };
        var keyString = this.key || this;
        var value = getValueFromKeyString(keyString, object)
        return fn(value, object);
    },

    'getFieldIndex': function (fields) {
        return _.indexOf(fields, this);
    },

    'getKey': function () {
        return this.key || this;
    },

    'getLabel': function () {
        return this.label || this;
    },

    'isSortKey': function (field, group, fields) {
        return Session.equals(getSessionSortKey(group), _.indexOf(fields, field));
    },

    'isSortable': function () {
        return true;
    },

    'isAscending' : function (group) {
        var sortDirection = Session.get(getSessionSortDirectionKey(group));
        return (sortDirection === 1);
    },

    'sortedRows': function () {
        var sortDirection = Session.get(getSessionSortDirectionKey(this.group));
        var sortKeyIndex = Session.get(getSessionSortKey(this.group));
        var sortKeyField = this.fields[sortKeyIndex] || {};

        var limit = Session.get(getSessionRowsPerPageKey(this.group));
        var currentPage = Session.get(getSessionCurrentPageKey(this.group));
        var skip = currentPage * limit;
        var filterQuery = getFilterQuery(this.group, this.fields);

        if (sortKeyField.fn) {
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
        return Session.get(getSessionFilterKey(this.group)) || '';
    },

    'getRowsPerPage' : function () {
        return Session.get(getSessionRowsPerPageKey(this.group));
    },

    'getCurrentPage' : function () {
        return 1 + Session.get(getSessionCurrentPageKey(this.group));
    },

    'isntFirstPage' : function () {
        return Session.get(getSessionCurrentPageKey(this.group)) > 0;
    },

    'isntLastPage' : function () {
        var currentPage = 1 + Session.get(getSessionCurrentPageKey(this.group));
        var rowsPerPage = Session.get(getSessionRowsPerPageKey(this.group));
        var filterQuery = getFilterQuery(this.group, this.fields);
        var count = this.collection.find(filterQuery).count();
        return currentPage < Math.ceil(count / rowsPerPage);
    },

    'showNavigation' : function () {
        if (Session.get(getSessionShowNavigationKey(this.group)) === 'always') return true;
        if (Session.get(getSessionShowNavigationKey(this.group)) === 'never') return false;
        return Template.reactiveTable.getPageCount.call(this) > 1;
    }
});

Template.reactiveTable.events({
    'click .reactive-table .sortable': function (event) {
        var target = $(event.target).is('i') ? $(event.target).parent() : $(event.target);
        var sortIndex = parseInt(target.attr('index'), 10);
        var group = target.parents('.reactive-table').attr('reactive-table-group');
        var currentSortIndex = Session.get(getSessionSortKey(group));
        if (currentSortIndex === sortIndex) {
            var sortDirection = -1 * Session.get(getSessionSortDirectionKey(group));
            Session.set(getSessionSortDirectionKey(group), sortDirection);
        } else {
            Session.set(getSessionSortKey(group), sortIndex);
        }
    },

    'keyup .reactive-table-filter input': function (event) {
        var filterText = $(event.target).val();
        var group = $(event.target).parents('.reactive-table-filter').attr('reactive-table-group');
        Session.set(getSessionFilterKey(group), filterText);
        Session.set(getSessionCurrentPageKey(this.group), 0);
    },

    'change .reactive-table-navigation .rows-per-page input': function (event) {
        try {
            var rowsPerPage = parseInt($(event.target).val(), 10);
            var group = $(event.target).parents('.reactive-table-navigation').attr('reactive-table-group');
            Session.set(getSessionRowsPerPageKey(group), rowsPerPage);
        } catch (e) {
            console.log('rows per page must be an integer');
        }
    },

    'change .reactive-table-navigation .page-number input': function (event) {
        try {
            var currentPage = parseInt($(event.target).val(), 10) - 1;
            var group = $(event.target).parents('.reactive-table-navigation').attr('reactive-table-group');
            Session.set(getSessionCurrentPageKey(group), currentPage);
        } catch (e) {
            console.log('current page must be an integer');
        }
    },

    'click .reactive-table-navigation .previous-page': function (event) {
        var group = $(event.target).parents('.reactive-table-navigation').attr('reactive-table-group');
        var currentPageKey = getSessionCurrentPageKey(group);
        var currentPage = Session.get(currentPageKey);
        Session.set(currentPageKey, currentPage - 1);
    },

    'click .reactive-table-navigation .next-page': function (event) {
        var group = $(event.target).parents('.reactive-table-navigation').attr('reactive-table-group');
        var currentPageKey = getSessionCurrentPageKey(group);
        var currentPage = Session.get(currentPageKey);
        Session.set(currentPageKey, currentPage + 1);
    }
});


Template.reactiveTable_edit_cell.helpers({
    'getEditContext' : function(doc){
        context = {
            computed: Template.reactiveTable.getField.call(this, doc),
            actual: getValueFromKeyString(this.key, doc),
            doc: doc
        };
        return context;
    }
})

Template.reactiveTable_edit_cell.events({
    'click .real-value': function(e,tmpl){
        if(typeof this.actual !== 'string'){
            console.log('Sorry, you only edit strings for now.')
        }else{
            var self = this;
            var $realValue = $(e.currentTarget).hide()

            $('.reactive-table input.inline-edit').blur()
            var $input = $("<input type='text' class='inline-edit form-control' value='"+this.actual+"'/>").on('change',function(){
                update = {'$set':{}}
                update['$set'][tmpl.data.key] = $(this).val()
                tmpl.data.edit.update({_id:self.doc._id},update)
            }).on('blur',function(){
                $(this).remove()
                $realValue.show()
            })
            $realValue.after($input)
        }
    }
})

