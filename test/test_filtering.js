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
