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

getSortedFields = function (fields, multiColumnSort) {
  var filteredFields = _.filter(fields, function (field) {
    return field.sortOrder.get() < Infinity;
  });
  if (!filteredFields.length) {
    var firstSortableField = _.find(fields, function (field) {
      return _.isUndefined(field.sortable) || field.sortable !== false;
    });
    if (firstSortableField) {
      filteredFields = [firstSortableField];
    }
  }
  var sortedFields = _.sortBy(filteredFields, function (field) {
    return field.sortOrder.get();
  });
  return multiColumnSort ? sortedFields : sortedFields.slice(0, 1);
}

getSortQuery = function (fields, multiColumnSort) {
  var sortedFields = getSortedFields(fields, multiColumnSort);
  var sortQuery = {};
  _.each(sortedFields, function (field) {
    sortQuery[field.key] = field.sortDirection.get();
  });
  return sortQuery;
};

sortWithFunctions = function (rows, fields, multiColumnSort) {
  var sortedFields = getSortedFields(fields, multiColumnSort);
  var sortedRows = rows;

  _.each(sortedFields.reverse(), function (field) {
    if (field.sortByValue || !field.fn) {
      sortedRows = _.sortBy(sortedRows, field.key);
    } else {
      sortedRows = _.sortBy(sortedRows, function (row) {
        return field.fn( get( row, field.key ), row );
      });
    }
    if (field.sortDirection.get() === -1) {
      sortedRows.reverse();
    }
  });
  return sortedRows;
};

getPrimarySortField = function (fields, multiColumnSort) {
  return getSortedFields(fields, multiColumnSort)[0];
};

changePrimarySort = function(fieldId, fields, multiColumnSort) {
  var primarySortField = getPrimarySortField(fields, multiColumnSort);
  if (primarySortField && primarySortField.fieldId === fieldId) {
    var sortDirection = -1 * primarySortField.sortDirection.get();
    primarySortField.sortDirection.set(sortDirection);
    primarySortField.sortOrder.set(0);
  } else {
    _.each(fields, function (field) {
      if (field.fieldId === fieldId) {
        field.sortOrder.set(0);
        if (primarySortField) {
          field.sortDirection.set(primarySortField.sortDirection.get());
        }
      } else {
        var sortOrder = 1 + field.sortOrder.get();
        field.sortOrder.set(sortOrder);
      }
    });
  }
};