Tinytest.add('Pagination - initial page', function (test) {
  testTable(
    {collection: rows, settings: {rowsPerPage: 2}},
    function () {
      test.length($('.reactive-table tbody tr'), 2, "two rows should be rendered");
      test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "should be on the first page");
      test.equal($('.reactive-table-navigation .page-number input').val(), "1", "displayed page number should be 1");
      test.length($('.reactive-table-navigation .page-number label .page-number-count').text().match(/3/), 1, "displayed page count should be 3");
    }
  );
});

testAsyncMulti('Pagination - previous/next controls', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows, settings: {rowsPerPage: 2}},
    document.body
  );

  test.length($('.reactive-table-navigation .previous-page'), 0, "first page shouldn't have previous button");

  var expectBackToFirstPage = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "should be on first page");
    test.length($('.reactive-table tbody tr'), 2, "second page should have two rows");
    test.equal($('.reactive-table-navigation .page-number input').val(), "1", "displayed page number should be 1");

    Blaze.remove(table);
  });

  var expectBackToSecondPage = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Claude Shannon", "should be on the second page");
    test.length($('.reactive-table tbody tr'), 2, "second page should have two rows");
    test.equal($('.reactive-table-navigation .page-number input').val(), "2", "displayed page number should be 2");

    $('.reactive-table-navigation .previous-page').click();
    Meteor.setTimeout(expectBackToFirstPage, 0);
  });

  var expectLastPage = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Marie Curie", "should be on last page");
    test.length($('.reactive-table tbody tr'), 2, "last page should have two rows");
    test.equal($('.reactive-table-navigation .page-number input').val(), "3", "displayed page number should be 3");
    test.length($('.reactive-table-navigation .next-page'), 0, "last page shouldn't have next button");

    $('.reactive-table-navigation .previous-page').click();
    Meteor.setTimeout(expectBackToSecondPage, 0);
  });

  var expectSecondPage = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Claude Shannon", "should be on the second page");
    test.length($('.reactive-table tbody tr'), 2, "second page should have two rows");
    test.equal($('.reactive-table-navigation .page-number input').val(), "2", "displayed page number should be 2");

    $('.reactive-table-navigation .next-page').click();
    Meteor.setTimeout(expectLastPage, 0);
  });

  $('.reactive-table-navigation .next-page').click();
  Meteor.setTimeout(expectSecondPage, 0);
}]);


Tinytest.add('Pagination - rows per page', function (test) {
  testTable(
    {collection: rows, settings: {showRowCount: true}},
    function() {
      test.equal($('.reactive-table-navigation .rows-per-page .rows-per-page-count').text(), "6");
    })
});

testAsyncMulti('Pagination - rows per page while filtering', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows, settings: {showRowCount: true}},
    document.body
  );
  test.length($('.reactive-table tbody tr'), 6, "initial six rows");

  var expectTwoRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 2, "filtered to two rows");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Carl Friedrich Gauss", "filtered first row");
    test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Grace Hopper", "filtered second row");
    test.equal($('.reactive-table-navigation .rows-per-page .rows-per-page-count').text(), "2", "Number of rows should be 2");
    Blaze.remove(table);
  });

  $('.reactive-table-filter input').val('g');
  $('.reactive-table-filter input').trigger('input');
  Meteor.setTimeout(expectTwoRows, 1000);
}]);

testAsyncMulti('Pagination - changing rows per page sets current page to last when past it', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows, settings: {rowsPerPage: 2}},
    document.body
  );

  var expectFirstPage = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "should be on first page");
    test.length($('.reactive-table tbody tr'), 6, "first page should have six rows");
    test.equal($('.reactive-table-navigation .page-number input').val(), "1", "displayed page number should be 1");

    Blaze.remove(table);
  });

  var expectSecondPage = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Claude Shannon", "should be on the second page");
    test.length($('.reactive-table tbody tr'), 2, "second page should have two rows");
    test.equal($('.reactive-table-navigation .page-number input').val(), "2", "displayed page number should be 2");

    $('.reactive-table-navigation .rows-per-page input').val("6");
    $('.reactive-table-navigation .rows-per-page input').trigger("change");
    Meteor.setTimeout(expectFirstPage, 0);
  });

  $('.reactive-table-navigation .next-page').click();
  Meteor.setTimeout(expectSecondPage, 0);
}]);

testAsyncMulti('Pagination - page input', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows, settings: {rowsPerPage: 2}},
    document.body
  );

  var expectFirstPage = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "should be on first page");
    test.length($('.reactive-table tbody tr'), 2, "first page should have two rows");
    test.equal($('.reactive-table-navigation .page-number input').val(), "1", "displayed page number should be 1");

    Blaze.remove(table);
  });

  var expectSecondPage = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Claude Shannon", "should be on the second page");
    test.length($('.reactive-table tbody tr'), 2, "second page should have two rows");
    test.equal($('.reactive-table-navigation .page-number input').val(), "2", "displayed page number should be 2");

    $('.reactive-table-navigation .page-number input').val("1");
    $('.reactive-table-navigation .page-number input').trigger("change");
    Meteor.setTimeout(expectFirstPage, 0);
  });

  var expectLastPage = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Marie Curie", "should be on last page");
    test.length($('.reactive-table tbody tr'), 2, "last page should have two rows");
    test.equal($('.reactive-table-navigation .page-number input').val(), "3", "displayed page number should be 3");

    $('.reactive-table-navigation .page-number input').val('2');
    $('.reactive-table-navigation .page-number input').trigger("change");
    Meteor.setTimeout(expectSecondPage, 0);
  });

  $('.reactive-table-navigation .page-number input').val("3");
  $('.reactive-table-navigation .page-number input').trigger("change");
  Meteor.setTimeout(expectLastPage, 0);
}]);

testAsyncMulti('Pagination - server-side', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: 'collection', fields: ['name', 'score'], rowsPerPage: 2},
    document.body
  );

  var expectBackToFirstPage = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "should be on first page");
    test.length($('.reactive-table tbody tr'), 2, "second page should have two rows");
    test.equal($('.reactive-table-navigation .page-number input').val(), "1", "displayed page number should be 1");

    Blaze.remove(table);
  });

  var expectBackToSecondPage = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Claude Shannon", "should be on the second page");
    test.length($('.reactive-table tbody tr'), 2, "second page should have two rows");
    test.equal($('.reactive-table-navigation .page-number input').val(), "2", "displayed page number should be 2");

    $('.reactive-table-navigation .previous-page').click();
    Meteor.setTimeout(expectBackToFirstPage, 500);
  });

  var expectLastPage = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Marie Curie", "should be on last page");
    test.length($('.reactive-table tbody tr'), 2, "last page should have two rows");
    test.equal($('.reactive-table-navigation .page-number input').val(), "3", "displayed page number should be 3");
    test.length($('.reactive-table-navigation .next-page'), 0, "last page shouldn't have next button");

    $('.reactive-table-navigation .previous-page').click();
    Meteor.setTimeout(expectBackToSecondPage, 500);
  });

  var expectSecondPage = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Claude Shannon", "should be on the second page");
    test.length($('.reactive-table tbody tr'), 2, "second page should have two rows");
    test.equal($('.reactive-table-navigation .page-number input').val(), "2", "displayed page number should be 2");

    $('.reactive-table-navigation .next-page').click();
    Meteor.setTimeout(expectLastPage, 500);
  });

  var expectFirstPage = expect(function () {
    test.length($('.reactive-table tbody tr'), 2, "two rows should be rendered");
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "should be on the first page");
    test.equal($('.reactive-table-navigation .page-number input').val(), "1", "displayed page number should be 1");
    test.length($('.reactive-table-navigation .page-number label .page-number-count').text().match(/3/), 1, "displayed page count should be 3");
    test.length($('.reactive-table-navigation .page-number label .page-number-count').text().match(/3/), 1, "displayed page count should be 3");
    test.length($('.reactive-table-navigation .previous-page'), 0, "first page shouldn't have previous button");

    $('.reactive-table-navigation .next-page').click();
    Meteor.setTimeout(expectSecondPage, 500);
  });

  Meteor.setTimeout(expectFirstPage, 500);
}]);
