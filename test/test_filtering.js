testAsyncMulti('Filtering - one input', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows, settings: {group: _.uniqueId()}},
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
    {collection: rows, settings: {group: _.uniqueId()}},
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
