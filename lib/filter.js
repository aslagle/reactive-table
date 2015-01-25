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

getFilterQuery = function (filterStrings, filterFields) {
  var numberRegExp = /^\d+$/;
  var queryList = [];
  _.each(filterStrings, function (filter, index) {
    if (filter) {
      var filters = parseFilterString(filter);
      _.each(filters, function (filterWord) {
        var filterQueryList = [];
        _.each(filterFields[index], function (field) {
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
  });
  return queryList.length ? {'$and': queryList} : {};
};

if (Meteor.isClient) {
  ReactiveTable = ReactiveTable || {};

  var reactiveTableFilters = {};
  var callbacks = {};

  ReactiveTable.Filter = function (id, fields) {
    if (reactiveTableFilters[id]) {
        return reactiveTableFilters[id];
    }
      
    var filter = new ReactiveVar();

    this.fields = fields;

    this.get = function () {
      return filter.get() || '';
    };

    this.set = function (filterString) {
      filter.set(filterString);
      _.each(callbacks[id], function (callback) {
        callback();
      });
    };
      
    reactiveTableFilters[id] = this;
  };
    
  ReactiveTable.clearFilters = function (filterIds) {
    _.each(filterIds, function (filterId) {
      if (reactiveTableFilters[filterId]) {
        reactiveTableFilters[filterId].set('');
      }
    });
  };

  dependOnFilters = function (filterIds, callback) {
    _.each(filterIds, function (filterId) {
      if (_.isUndefined(callbacks[filterId])) {
        callbacks[filterId] = [];
      }
      callbacks[filterId].push(callback);
    });
  };

  getFilterStrings = function (filterIds) {
    return _.map(filterIds, function (filterId) {
      if (_.isUndefined(reactiveTableFilters[filterId])) {
        return '';
      }
      return reactiveTableFilters[filterId].get();
    });
  };

  getFilterFields = function (filterIds, allFields) {
    return _.map(filterIds, function (filterId) {
      if (_.isUndefined(reactiveTableFilters[filterId])) {
        return allFields;
      } else if (_.isEmpty(reactiveTableFilters[filterId].fields)) {
        return allFields;
      } else {
        return reactiveTableFilters[filterId].fields;
      }
    });
  };

  Template.reactiveTableFilter.helpers({
    'filter': function () {
      if (_.isUndefined(reactiveTableFilters[this.id])) {
        new ReactiveTable.Filter(this.id, this.fields);
      }
      return reactiveTableFilters[this.id].get();
    }
  });

  var updateFilter = _.debounce(function (template, filterText) {
    reactiveTableFilters[template.data.id].set(filterText);
  }, 200);

  Template.reactiveTableFilter.events({
    'keyup .reactive-table-filter .reactive-table-input, input .reactive-table-filter .reactive-table-input': function (event) {
      var template = Template.instance();
      var filterText = $(event.target).val();
      updateFilter(template, filterText);
    },
  });
}
