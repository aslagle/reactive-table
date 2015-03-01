testAsyncMulti('Filtering - one input', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows},
    document.body
  );
  test.length($('.reactive-table tbody tr'), 6, "initial six rows");

  var expectTwoRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 2, "filtered to two rows");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Carl Friedrich Gauss", "filtered first row");
    test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Grace Hopper", "filtered second row");
    Blaze.remove(table);
  });

  $('.reactive-table-filter input').val('g');
  $('.reactive-table-filter input').trigger('input');
  Meteor.setTimeout(expectTwoRows, 1000);
}]);

testAsyncMulti('Filtering - two inputs', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows},
    document.body
  );
  test.length($('.reactive-table tbody tr'), 6, "initial six rows");

  var expectOneRow = expect(function () {
    test.length($('.reactive-table tbody tr'), 1, "filtered to one row");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Grace Hopper", "filtered row");
    Blaze.remove(table);
  });

  $('.reactive-table-filter input').val('g hopper');
  $('.reactive-table-filter input').trigger('input');
  Meteor.setTimeout(expectOneRow, 1000);
}]);

testAsyncMulti('Filtering - quotes', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows},
    document.body
  );
  test.length($('.reactive-table tbody tr'), 6, "initial six rows");

  var expectZeroRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 0, "filtered to zero rows");
    Blaze.remove(table);
  });

  var expectOneRow = expect(function () {
    test.length($('.reactive-table tbody tr'), 1, "filtered to one row");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Grace Hopper", "filtered first row");

    $('.reactive-table-filter input').val("\"hopper grace\"");
    $('.reactive-table-filter input').trigger('input');
    Meteor.setTimeout(expectZeroRows, 1000);
  });

  $('.reactive-table-filter input').val("\"grace hopper\"");
  $('.reactive-table-filter input').trigger('input');
  Meteor.setTimeout(expectOneRow, 1000);
}]);

testAsyncMulti('Filtering - numerical', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows},
    document.body
  );
  test.length($('.reactive-table tbody tr'), 6, "initial six rows");

  var expectThreeRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 3, "filtered to three rows");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "filtered first row");
    test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Claude Shannon", "filtered second row");
    Blaze.remove(table);
  });

  $('.reactive-table-filter input').val("5");
  $('.reactive-table-filter input').trigger('input');
  Meteor.setTimeout(expectThreeRows, 1000);
}]);

testAsyncMulti('Filtering - numbers in strings', [function (test, expect) {
  var numberStringRows = _.map(rows, function (row) {
    var newRow = {name: row.name, score: row.score + "points"};
    return newRow;
  });
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: numberStringRows},
    document.body
  );
  test.length($('.reactive-table tbody tr'), 6, "initial six rows");

  var expectThreeRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 4, "filtered to four rows");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "filtered first row");
    test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Claude Shannon", "filtered second row");
    test.equal($('.reactive-table tbody tr:nth-child(4) td:first-child').text(), "Nikola Tesla", "filtered fourth row");
    Blaze.remove(table);
  });

  $('.reactive-table-filter input').val("5");
  $('.reactive-table-filter input').trigger('input');
  Meteor.setTimeout(expectThreeRows, 1000);
}]);

testAsyncMulti('Filtering - server-side', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: 'collection', fields: ['name', 'score']},
    document.body
  );

  var expectTwoRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 2, "filtered to two rows");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Carl Friedrich Gauss", "filtered first row");
    test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Grace Hopper", "filtered second row");
    Blaze.remove(table);
  });

  var expectSixRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 6, "initial 6 rows");

    $('.reactive-table-filter input').val('g');
    $('.reactive-table-filter input').trigger('input');
    Meteor.setTimeout(expectTwoRows, 1000);
  });

  Meteor.setTimeout(expectSixRows, 500);
}]);

testAsyncMulti('Filtering - enableRegex false client side', [function (test, expect) {
  var rows = [
    {name: 'item 1', value: '1+2'},
    {name: 'item 2', value: 'abc'}
  ];
    
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows},
    document.body
  );
  test.length($('.reactive-table tbody tr'), 2, "initial two rows");

  var expectOneRow = expect(function () {
    test.length($('.reactive-table tbody tr'), 1, "filtered to one row");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "item 1", "filtered first row");
    Blaze.remove(table);
  });

  $('.reactive-table-filter input').val('+');
  $('.reactive-table-filter input').trigger('input');
  Meteor.setTimeout(expectOneRow, 1000);
}]);
    
testAsyncMulti('Filtering - enableRegex true client side', [function (test, expect) {
  var rows = [
    {name: 'item 1', value: '1+2'},
    {name: 'item 2', value: 'abc'}
  ];
    
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows, enableRegex: true},
    document.body
  );
  test.length($('.reactive-table tbody tr'), 2, "initial two rows");
    
  var expectTwoRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 2, "filtered to both rows");
    Blaze.remove(table);
  });

  var expectOneRow = expect(function () {
    test.length($('.reactive-table tbody tr'), 1, "filtered to one row");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "item 1", "filtered first row");
    
    $('.reactive-table-filter input').val('a|1');
    $('.reactive-table-filter input').trigger('input');
    Meteor.setTimeout(expectTwoRows, 1000);
  });

  $('.reactive-table-filter input').val('\\+');
  $('.reactive-table-filter input').trigger('input');
  Meteor.setTimeout(expectOneRow, 1000);
}]);

testAsyncMulti('Filtering - enableRegex false server side', [function (test, expect) {    
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: 'filter-regex-disabled', fields: ['name', 'value']},
    document.body
  );

  var expectOneRow = expect(function () {
    test.length($('.reactive-table tbody tr'), 1, "filtered to one row");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "item 1", "filtered first row");
    Blaze.remove(table);
  });
    
  var expectInitialRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 2, "initial two rows");
      
    $('.reactive-table-filter input').val('+');
    $('.reactive-table-filter input').trigger('input');
    Meteor.setTimeout(expectOneRow, 1000);
  });

  Meteor.setTimeout(expectInitialRows, 500);
}]);
    
testAsyncMulti('Filtering - enableRegex true server side', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: 'filter-regex-enabled', fields: ['name', 'value']},
    document.body
  );
    
  var expectTwoRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 2, "filtered to both rows");
    Blaze.remove(table);
  });

  var expectOneRow = expect(function () {
    test.length($('.reactive-table tbody tr'), 1, "filtered to one row");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "item 1", "filtered first row");
    
    $('.reactive-table-filter input').val('a|1');
    $('.reactive-table-filter input').trigger('input');
    Meteor.setTimeout(expectTwoRows, 1000);
  });
    
  var expectInitialRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 2, "initial two rows");
      
    $('.reactive-table-filter input').val('\\+');
    $('.reactive-table-filter input').trigger('input');
    Meteor.setTimeout(expectOneRow, 1000);
  });

  Meteor.setTimeout(expectInitialRows, 500);
}]);

testAsyncMulti('Filtering - server-side field inclusion', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: 'filter-inclusion', fields: ['name', 'value']},
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
      
    $('.reactive-table-filter input').val('abc');
    $('.reactive-table-filter input').trigger('input');
    Meteor.setTimeout(expectNoRows, 1000);
  });

  Meteor.setTimeout(expectTwoRowsNoValues, 500);
}]);

testAsyncMulti('Filtering - server-side field exclusion', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: 'filter-exclusion', fields: ['name', 'value']},
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
      
    $('.reactive-table-filter input').val('abc');
    $('.reactive-table-filter input').trigger('input');
    Meteor.setTimeout(expectNoRows, 1000);
  });

  Meteor.setTimeout(expectTwoRowsNoValues, 500);
}]);

