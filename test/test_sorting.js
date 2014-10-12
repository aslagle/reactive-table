testAsyncMulti('Sorting - direction', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows, settings: {group: _.uniqueId()}},
    document.body
  );
  test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "initial first row");
  test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Carl Friedrich Gauss", "initial second row");
  test.equal($('.reactive-table tbody tr:nth-child(4) td:first-child').text(), "Grace Hopper", "initial fourth row");

  var expectAscending = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "ascending first row");
    test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Carl Friedrich Gauss", "ascending second row");
    test.equal($('.reactive-table tbody tr:nth-child(4) td:first-child').text(), "Grace Hopper", "ascending fourth row");
    Blaze.remove(table);
  });

  var expectDescending = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Nikola Tesla", "descending first row");
    test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Marie Curie", "descending second row");
    test.equal($('.reactive-table tbody tr:nth-child(4) td:first-child').text(), "Claude Shannon", "descending fourth row");

    $('.reactive-table th:first-child').click();
    Meteor.setTimeout(expectAscending, 0);
  });

  $('.reactive-table th:first-child').click();
  Meteor.setTimeout(expectDescending, 0);
}]);

testAsyncMulti('Sorting - column', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: collection, settings: {group: _.uniqueId()}},
    document.body
  );
  test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "initial first row");
  test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Carl Friedrich Gauss", "initial second row");
  test.equal($('.reactive-table tbody tr:nth-child(4) td:first-child').text(), "Grace Hopper", "initial fourth row");

  var expectSecondColumnDescending = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Nikola Tesla", "2nd column descending first row");
    test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Grace Hopper", "2nd column descending second row");
    test.equal($('.reactive-table tbody tr:nth-child(4) td:first-child').text(), "Marie Curie", "2nd column descending fourth row");
    Blaze.remove(table);
  });

  var expectSecondColumn = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Carl Friedrich Gauss", "2nd column first row");
    test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Ada Lovelace", "2nd column second row");
    test.equal($('.reactive-table tbody tr:nth-child(4) td:first-child').text(), "Claude Shannon", "2nd column fourth row");

    $('.reactive-table th:nth-child(2)').click();
    Meteor.setTimeout(expectSecondColumnDescending, 0);
  });

  $('.reactive-table th:nth-child(2)').click();
  Meteor.setTimeout(expectSecondColumn, 0);
}]);
