normalizeSort = function (field, oldField) {
  // preserve user sort settings
  if (oldField && _.has(oldField, 'sortOrder')) {
    field.sortOrder = oldField.sortOrder;
  }
  if (oldField && _.has(oldField, 'sortDirection')) {
    field.sortDirection = oldField.sortDirection;
  }
  
  // backwards-compatibility
  if (!_.has(field, 'sortOrder') && _.has(field, 'sort')) {
    console.warn('reactiveTable warning: The "sort" option for fields is deprecated');
    field.sortOrder = 0;
    field.sortDirection = field.sort;
  }


  var sortOrder;
  
  if (!_.has(field, 'sortOrder')) {
    sortOrder = Infinity;
    field.sortOrder = new ReactiveVar();
  } else if (field.sortOrder instanceof ReactiveVar) {
    sortOrder = field.sortOrder.get()
  } else {
    sortOrder = field.sortOrder;
    field.sortOrder = new ReactiveVar();
  }

  if (!_.isNumber(sortOrder) || sortOrder < 0) {
    console.error('reactiveTable error - sortOrder must be a postive number: ' + sortOrder);
    sortOrder = Infinity;
  }
  field.sortOrder.set(sortOrder);

  var sortDirection;

  if (!_.has(field, 'sortDirection')) {
    sortDirection = 1;
    field.sortDirection = new ReactiveVar()
  } else if (field.sortDirection instanceof ReactiveVar) {
    sortDirection = field.sortDirection.get();
  } else {
    sortDirection = field.sortDirection;
    field.sortDirection = new ReactiveVar();
  }

  if (sortDirection === 'desc' || sortDirection === 'descending' || sortDirection === -1) {
    sortDirection = -1;
  } else if (sortDirection) {
    sortDirection = 1;
  } 
  field.sortDirection.set(sortDirection);
};

var getSortedFields = function (fields) {
  return _.sortBy(fields, function (field) {
    return field.sortOrder.get();
  });
}

getSortQuery = function (fields) {
  var sortedFields = getSortedFields(fields);
  var sortQuery = {};
  _.each(sortedFields, function (field) {
    sortQuery[field.key] = field.sortDirection.get();
  });
  return sortQuery;
};

sortWithFunctions = function (rows, fields) {
  var sortedFields = getSortedFields(fields);
  var sortedRows = rows;

  _.each(sortedFields.reverse(), function (field) {
    if (field.sortByValue || !field.fn) {
      sortedRows = _.sortBy(sortedRows, field.key);
    } else {
      sortedRows = _.sortBy(sortedRows, function (row) {
        return field.fn(row[field.key], row);
      });
    }
    if (field.sortDirection.get() === -1) {
      sortedRows.reverse();
    }
  });
  return sortedRows;
};

getPrimarySortField = function (fields) {
  var minSortField = _.min(fields, function (field) {
    return field.sortOrder.get();
  });
  // if all values are Infinity _.min returns Infinity instead of the object
  if (minSortField === Infinity) {
    minSortField = fields[0];
  }
  return minSortField;
};

changePrimarySort = function(fieldId, fields) {
  var primarySortField = getPrimarySortField(fields);
  if (primarySortField.fieldId === fieldId) {
    var sortDirection = -1 * primarySortField.sortDirection.get();
    primarySortField.sortDirection.set(sortDirection);
    primarySortField.sortOrder.set(0);
  } else {
    _.each(fields, function (field) {
      if (field.fieldId === fieldId) {
        field.sortOrder.set(0);
      } else {
        var sortOrder = 1 + field.sortOrder.get();
        field.sortOrder.set(sortOrder);
      }
    });
  }
};