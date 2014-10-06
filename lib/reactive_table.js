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

var getSessionVisibleFieldsKey = function (group) {
    return group + '-reactive-table-visible-fields';
};

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

    var parseField = function (field, i) {
        if (field.sort) {
            settings.sortKey = i;
            if (field.sort === 'desc' || field.sort === 'descending'  || field.sort === -1) {
                settings.sortDirectionKey = -1;
            }
        }
        return normalizeField(field);
    };

    fields = _.map(fields, parseField);

    var visibleFields = [];
    _.each(fields, function (field, i) {
        if (!field.hidden || (_.isFunction(field.hidden) && !field.hidden())) {
          visibleFields.push(i);
        }
    });

    Session.setDefault(getSessionSortKey(group), settings.sortKey || 0);
    Session.setDefault(getSessionSortDirectionKey(group), settings.sortDirectionKey || 1);
    Session.setDefault(getSessionRowsPerPageKey(group), settings.rowsPerPage || 10);
    Session.setDefault(getSessionCurrentPageKey(group), 0);
    Session.setDefault(getSessionShowNavigationKey(group), settings.showNavigation || 'always');
    Session.setDefault(getSessionFilterKey(group), null);
    if (visibleFields.length > 0) {
        Session.setDefault(getSessionVisibleFieldsKey(group), visibleFields);
    }
    var showFilter = (typeof settings.showFilter === "undefined" ? true : settings.showFilter);

    var rowClass = settings.rowClass || function() {return ''};
    if (typeof rowClass === 'string') {
        var tmp = rowClass;
        rowClass = function(obj) { return tmp; };
    }

    return {
        group: group,
        collection: collection,
        settings: settings,
        fields: fields,
        useFontAwesome: settings.useFontAwesome,
        showFilter: showFilter,
        showColumnToggles: settings.showColumnToggles,
        rowClass: rowClass
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

Template.reactiveTable.helpers({
    'generateSettings': generateSettings,

    'getField': function (object) {
        var fn = this.fn || function (value) { return value; };
        var key = this.key || this;
        var value = get(object, key);
        return fn(value, object);
    },

    'getFieldIndex': function (fields) {
        return _.indexOf(fields, this);
    },

    'getKey': function () {
        return this.key || this;
    },

    'getLabel': function () {
        return _.isString(this.label) ? this.label : this;
    },

    'isSortKey': function (field, group, fields) {
        return Session.equals(getSessionSortKey(group), _.indexOf(fields, field));
    },

    'isSortable': function () {
        return true;
    },

    'isVisible': function (field, group, fields) {
        return _.include(Session.get(getSessionVisibleFieldsKey(group)), _.indexOf(fields, field));
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
    },

    'hasClass' : function (data) {
        return data.class || 'table table-striped table-hover';
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

    'change .reactive-table-add-column input': function (event) {
        var target = $(event.target);
        var index = parseInt(target.attr('index'), 10);
        var group = target.parents('.reactive-table').attr('reactive-table-group');
        var sessionVisibleFieldsKey = getSessionVisibleFieldsKey(group);
        var currentVisibleFields = Session.get(sessionVisibleFieldsKey);
        if (_.include(currentVisibleFields, index)) {
            Session.set(sessionVisibleFieldsKey, _.without(currentVisibleFields, index));
        } else {
            Session.set(sessionVisibleFieldsKey, currentVisibleFields.concat(index));
        }
        event.stopPropagation();
        return false;
    },

    'keyup .reactive-table-filter .reactive-table-input, input .reactive-table-filter .reactive-table-input': _.debounce(function (event) {
        var filterText = $(event.target).val();
        var group = $(event.target).parents('.reactive-table-filter').attr('reactive-table-group');
        Session.set(getSessionFilterKey(group), filterText);
        Session.set(getSessionCurrentPageKey(this.group), 0);
    }, 200),

    'change .reactive-table-navigation .rows-per-page input': function (event) {
        var rowsPerPage = Math.max(~~$(event.target).val(), 1);
        var group = $(event.target).parents('.reactive-table-navigation').attr('reactive-table-group');
        Session.set(getSessionRowsPerPageKey(group), rowsPerPage);
        $(event.target).val(rowsPerPage);
    },

    'change .reactive-table-navigation .page-number input': function (event) {
        var currentPage = Math.max(~~$(event.target).val(), 1);
        var group = $(event.target).parents('.reactive-table-navigation').attr('reactive-table-group');
        var pageCount = Template.reactiveTable.getPageCount.call(this);
        if (currentPage > pageCount) {
          currentPage = pageCount;
        }
        if (currentPage < 0) {
          currentPage = 1;
        }
        Session.set(getSessionCurrentPageKey(this.group), currentPage - 1);
        $(event.target).val(currentPage);
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
