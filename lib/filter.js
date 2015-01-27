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

var quoteRegex = function(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

getFilterQuery = function (filter, fields, settings) {
  settings = settings || {};
  if (settings.autoQuoteSearchterm === undefined) {
    settings.autoQuoteSearchterm = true;
  }
  var numberRegExp = /^\d+$/;
  var queryList = [];
  if (filter) {
    var filters = parseFilterString(filter);
    _.each(filters, function (filterWord) {
      var filterQueryList = [];
      _.each(fields, function (field) {
        if (settings.autoQuoteSearchterm === true) {
          filterWord = quoteRegex(filterWord);
        }
        var filterRegExp = new RegExp(filterWord, 'i');
        var query = {};
        query[field.key || field] = filterRegExp;
        filterQueryList.push(query);

        if (numberRegExp.test(filterWord)) {
          var numberQuery = {};
          numberQuery[field.key || field] = parseInt(filterWord, 10);
          filterQueryList.push(numberQuery);
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
