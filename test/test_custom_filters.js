Tinytest.add('Custom Filters - reactiveTableFilter template rendering', function (test) {
  var filter = Blaze.renderWithData(
    Template.reactiveTableFilter,
    {id: 'test-id'},
    document.body
  );
  test.length($('.reactive-table-input'), 1, 'filter should be rendered');
  test.length($('#test-id'), 1, 'filter should be rendered');
  Blaze.remove(filter);
});

Tinytest.add('Custom Filters - reactiveTableFilter template label', function (test) {
  var filter = Blaze.renderWithData(
    Template.reactiveTableFilter,
    {id: 'test-id', label: 'Test'},
    document.body
  );
  test.length($('#test-id .input-group-addon').text().trim().match(/^Test/), 1, "label should be Test");
  Blaze.remove(filter);
  
  filter = Blaze.renderWithData(
    Template.reactiveTableFilter,
    {id: 'test-id'},
    document.body
  );
  test.length($('#test-id .input-group-addon').text().trim().match(/^Filter/), 1, "default label should be Filter");
  Blaze.remove(filter);
});

Tinytest.add('Custom Filters - reactiveTableFilter class', function (test) {
  var filter = Blaze.renderWithData(
    Template.reactiveTableFilter,
    {id: 'test-id', class: 'test-class'},
    document.body
  );
  test.length($('#test-id.test-class .input-group-addon'), 1, "class should be test-class");
  Blaze.remove(filter);
});

testAsyncMulti('Custom Filters - reactiveTableFilter no fields', [function (test, expect) {
  var filter = Blaze.renderWithData(
    Template.reactiveTableFilter,
    {id: 'client-filter'},
    document.body
  );
  
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: collection, filters: ['client-filter']},
    document.body
  );
    
  var expectThreeRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 3, "filtered to three rows");
    Blaze.remove(table);
    Blaze.remove(filter);
  });

  var expectOneRow = expect(function () {
    test.length($('.reactive-table tbody tr'), 1, "filtered to one row");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "filtered first row");
    
    $('#client-filter input').val('5');
    $('#client-filter input').trigger('input');
    Meteor.setTimeout(expectThreeRows, 1000);
  });
    
  var expectInitialRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 6, "initial rows");
      
    $('#client-filter input').val('Ada');
    $('#client-filter input').trigger('input');
    Meteor.setTimeout(expectOneRow, 1000);
  });

  Meteor.setTimeout(expectInitialRows, 500);
}]);

testAsyncMulti('Custom Filters - reactiveTableFilter in server-side table', [function (test, expect) {
  var filter = Blaze.renderWithData(
    Template.reactiveTableFilter,
    {id: 'server-filter'},
    document.body
  );
  
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: 'collection', fields: ['name', 'score'], filters: ['server-filter']},
    document.body
  );
    
  var expectThreeRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 3, "filtered to three rows");
    Blaze.remove(table);
    Blaze.remove(filter);
  });

  var expectOneRow = expect(function () {
    test.length($('.reactive-table tbody tr'), 1, "filtered to one row");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "filtered first row");
    
    $('#server-filter input').val('5');
    $('#server-filter input').trigger('input');
    Meteor.setTimeout(expectThreeRows, 1000);
  });
    
  var expectInitialRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 6, "initial rows");
      
    $('#server-filter input').val('Ada');
    $('#server-filter input').trigger('input');
    Meteor.setTimeout(expectOneRow, 1000);
  });

  Meteor.setTimeout(expectInitialRows, 500);
}]);

testAsyncMulti('Custom Filters - reactiveTableFilter one field', [function (test, expect) {
  var filter = Blaze.renderWithData(
    Template.reactiveTableFilter,
    {id: 'name-only', fields: ['name']},
    document.body
  );
  
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: collection, filters: ['name-only']},
    document.body
  );
    
  var expectNoRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 0, "filtered to no rows");
    Blaze.remove(table);
    Blaze.remove(filter);
  });

  var expectOneRow = expect(function () {
    test.length($('.reactive-table tbody tr'), 1, "filtered to one row");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "filtered first row");
    
    $('#name-only input').val('5');
    $('#name-only input').trigger('input');
    Meteor.setTimeout(expectNoRows, 1000);
  });
    
  var expectInitialRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 6, "initial rows");
      
    $('#name-only input').val('Ada');
    $('#name-only input').trigger('input');
    Meteor.setTimeout(expectOneRow, 1000);
  });

  Meteor.setTimeout(expectInitialRows, 500);
}]);

testAsyncMulti('Custom Filters - reactiveTableFilter two fields', [function (test, expect) {
  var filter = Blaze.renderWithData(
    Template.reactiveTableFilter,
    {id: 'name-and-score'},
    document.body
  );
  
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: collection, filters: ['name-and-score']},
    document.body
  );
    
  var expectThreeRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 3, "filtered to three rows");
    Blaze.remove(table);
    Blaze.remove(filter);
  });

  var expectOneRow = expect(function () {
    test.length($('.reactive-table tbody tr'), 1, "filtered to one row");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "filtered first row");
    
    $('#name-and-score input').val('5');
    $('#name-and-score input').trigger('input');
    Meteor.setTimeout(expectThreeRows, 1000);
  });
    
  var expectInitialRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 6, "initial rows");
      
    $('#name-and-score input').val('Ada');
    $('#name-and-score input').trigger('input');
    Meteor.setTimeout(expectOneRow, 1000);
  });

  Meteor.setTimeout(expectInitialRows, 500);
}]);

testAsyncMulti('Custom Filters - reactiveTableFilter two filters', [function (test, expect) {
  var filter1 = Blaze.renderWithData(
    Template.reactiveTableFilter,
    {id: 'name-filter'},
    document.body
  );
  
  var filter2 = Blaze.renderWithData(
    Template.reactiveTableFilter,
    {id: 'score-filter'},
    document.body
  );
  
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: collection, filters: ['name-filter', 'score-filter']},
    document.body
  );
  
  var expectTwoRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 2, "filtered to two rows");
    Blaze.remove(table);
    Blaze.remove(filter1);
    Blaze.remove(filter2);
  });
    
  var expectStillOneRow = expect(function () {
    test.length($('.reactive-table tbody tr'), 1, "filtered to one row");
    
    $('#name-filter input').val('l');
    $('#name-filter input').trigger('input');
    Meteor.setTimeout(expectTwoRows, 1000);
  });

  var expectOneRow = expect(function () {
    test.length($('.reactive-table tbody tr'), 1, "filtered to one row");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "filtered first row");
    
    $('#score-filter input').val('5');
    $('#score-filter input').trigger('input');
    Meteor.setTimeout(expectStillOneRow, 1000);
  });
    
  var expectInitialRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 6, "initial rows");
      
    $('#name-filter input').val('Ada');
    $('#name-filter input').trigger('input');
    Meteor.setTimeout(expectOneRow, 1000);
  });

  Meteor.setTimeout(expectInitialRows, 500);
}]);

testAsyncMulti('Custom Filters - ReactiveTable.Filter no fields', [function (test, expect) {
  var id = 'filter' + _.uniqueId();
  var filter = new ReactiveTable.Filter(id);
  
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: collection, filters: [id]},
    document.body
  );
    
  var expectThreeRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 3, "filtered to three rows");
    test.equal(filter.get(), '5', 'filter.get() works');
    Blaze.remove(table);
  });

  var expectOneRow = expect(function () {
    test.length($('.reactive-table tbody tr'), 1, "filtered to one row");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "filtered first row");
    
    test.equal(filter.get(), 'Ada', 'filter.get() works');
    filter.set('5');
    Meteor.setTimeout(expectThreeRows, 1000);
  });
    
  var expectInitialRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 6, "initial rows");
      
    filter.set('Ada');
    Meteor.setTimeout(expectOneRow, 1000);
  });

  Meteor.setTimeout(expectInitialRows, 500);
}]);

testAsyncMulti('Custom Filters - ReactiveTable.Filter one field', [function (test, expect) {
  var id = 'filter' + _.uniqueId();
  var filter = new ReactiveTable.Filter(id, ['name']);
  
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: collection, filters: [id]},
    document.body
  );
    
  var expectNoRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 0, "filtered to no rows");
    test.equal(filter.get(), '5', 'filter.get() works');
    Blaze.remove(table);
  });

  var expectOneRow = expect(function () {
    test.length($('.reactive-table tbody tr'), 1, "filtered to one row");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "filtered first row");
    
    test.equal(filter.get(), 'Ada', 'filter.get() works');
    filter.set('5');
    Meteor.setTimeout(expectNoRows, 1000);
  });
    
  var expectInitialRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 6, "initial rows");
      
    filter.set('Ada');
    Meteor.setTimeout(expectOneRow, 1000);
  });

  Meteor.setTimeout(expectInitialRows, 500);
}]);

testAsyncMulti('Custom Filters - ReactiveTable.Filter two fields', [function (test, expect) {
  var id = 'filter' + _.uniqueId();
  var filter = new ReactiveTable.Filter(id, ['name', 'score']);
  
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: collection, filters: [id]},
    document.body
  );
    
  var expectThreeRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 3, "filtered to three rows");
    test.equal(filter.get(), '5', 'filter.get() works');
    Blaze.remove(table);
  });

  var expectOneRow = expect(function () {
    test.length($('.reactive-table tbody tr'), 1, "filtered to one row");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "filtered first row");
    
    test.equal(filter.get(), 'Ada', 'filter.get() works');
    filter.set('5');
    Meteor.setTimeout(expectThreeRows, 1000);
  });
    
  var expectInitialRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 6, "initial rows");
      
    filter.set('Ada');
    Meteor.setTimeout(expectOneRow, 1000);
  });

  Meteor.setTimeout(expectInitialRows, 500);
}]);

testAsyncMulti('Custom Filters - ReactiveTable.Filter mongo selector client-side', [function (test, expect) {
  var id = 'filter' + _.uniqueId();
  var filter = new ReactiveTable.Filter(id, ['score']);
  
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: collection, filters: [id]},
    document.body
  );
    
  var expectTwoRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 2, "filtered to two rows");
    Blaze.remove(table);
  });
    
  var expectInitialRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 6, "initial rows");
      
    filter.set({'$gte': 10});
    Meteor.setTimeout(expectTwoRows, 1000);
  });

  Meteor.setTimeout(expectInitialRows, 500);
}]);

testAsyncMulti('Custom Filters - ReactiveTable.Filter mongo selector server-side', [function (test, expect) {
  var id = 'filter' + _.uniqueId();
  var filter = new ReactiveTable.Filter(id, ['score']);
  
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: 'collection', fields: ['name', 'score'], filters: [id]},
    document.body
  );
    
  var expectTwoRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 2, "filtered to two rows");
    Blaze.remove(table);
  });
    
  var expectInitialRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 6, "initial rows");
      
    filter.set({'$gte': 10});
    Meteor.setTimeout(expectTwoRows, 1000);
  });

  Meteor.setTimeout(expectInitialRows, 500);
}]);

Tinytest.add('Custom Filters - ReactiveTable.clearFilters', function (test) {
  var id1 = _.uniqueId();
  var id2 = _.uniqueId();
  var id3 = _.uniqueId();
  
  var filter1 = new ReactiveTable.Filter(id1);
  var filter2 = new ReactiveTable.Filter(id2);
  var filter3 = new ReactiveTable.Filter(id3);
  
  filter1.set('abcd');
  filter2.set('efgh');
  filter3.set({'$lt': 3});
  
  test.equal('abcd', filter1.get(), 'get works');
  test.equal('efgh', filter2.get(), 'get works');
  test.equal({'$lt': 3}, filter3.get(), 'get works');
  
  ReactiveTable.clearFilters([id1]);
  test.equal('', filter1.get(), 'filter1 cleared');
  test.equal('efgh', filter2.get(), 'filter2 unchanged');
  test.equal({'$lt': 3}, filter3.get(), 'filter3 unchanged');
  
  ReactiveTable.clearFilters([id2, id3]);
  test.equal('', filter1.get(), 'filter1 unchanged');
  test.equal('', filter2.get(), 'filter2 cleared');
  test.equal('', filter3.get(), 'filter3 cleared');
});

testAsyncMulti('Custom Filters - ReactiveTable.Filter with server-side field inclusion', [function (test, expect) {
  var filterId = 'test' + _.uniqueId();
  var filter = new ReactiveTable.Filter(filterId, ['name']);

  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: 'filter-inclusion', fields: ['name', 'value'], filters: [filterId]},
    document.body
  );

  var expectNoRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 0, "no rows should match");
    Blaze.remove(table);
  });
    
  var expectTwoRowsNoValues = expect(function () {
    test.length($('.reactive-table tbody tr'), 2, "initial two rows");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "item 1", "first column content");
    test.equal($('.reactive-table tbody tr:first-child td:nth-child(2)').text(), "", "second column content");
    test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "item 2", "first column content");
    test.equal($('.reactive-table tbody tr:nth-child(2) td:nth-child(2)').text(), "", "second column content");
      
    filter.set("abc");
    Meteor.setTimeout(expectNoRows, 1000);
  });

  Meteor.setTimeout(expectTwoRowsNoValues, 500);
}]);

testAsyncMulti('Custom Filters - ReactiveTable.Filter with server-side field exclusion', [function (test, expect) {
  var filterId = 'test' + _.uniqueId();
  var filter = new ReactiveTable.Filter(filterId, ['name']);

  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: 'filter-exclusion', fields: ['name', 'value'], filters: [filterId]},
    document.body
  );

  var expectNoRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 0, "no rows should match");
    Blaze.remove(table);
  });
    
  var expectTwoRowsNoValues = expect(function () {
    test.length($('.reactive-table tbody tr'), 2, "initial two rows");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "item 1", "first column content");
    test.equal($('.reactive-table tbody tr:first-child td:nth-child(2)').text(), "", "second column content");
    test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "item 2", "first column content");
    test.equal($('.reactive-table tbody tr:nth-child(2) td:nth-child(2)').text(), "", "second column content");
      
    filter.set('abc');
    Meteor.setTimeout(expectNoRows, 1000);
  });

  Meteor.setTimeout(expectTwoRowsNoValues, 500);
}]);