Tinytest.add('Multiple tables - rendering', function (test) {
  testTable(
    {collection: rows, settings: {group: _.uniqueId()}},
    function () {
      testTable(
        {collection: collection, settings: {group: _.uniqueId()}},
        function () {
          test.length($('.reactive-table'), 2, "two tables should be rendered");
          test.length($('.reactive-table:nth-of-type(1) tbody tr'), 6, "the first table should have 6 rows");
          test.length($('.reactive-table:nth-of-type(2) tbody tr'), 6, "the second table should have 6 rows");
        }
      );
    }
  );
});

Tinytest.add('Multiple tables - settings', function (test) {
  testTable(
    {collection: rows, settings: {showNavigation: true, group: _.uniqueId()}},
    function () {
      testTable(
        {collection: collection, settings: {showNavigation: false, group: _.uniqueId()}},
        function () {
          test.length($('.reactive-table'), 2, "two tables should be rendered");
          test.length($('.reactive-table-navigation'), 1, "only one table should have navigation");
        }
      );
    }
  );

  testTable(
    {collection: rows, settings: {rowsPerPage: 5, group: _.uniqueId()}},
    function () {
      testTable(
        {collection: collection, settings: {rowsPerPage: 2, group: _.uniqueId()}},
        function () {
          test.length($('.reactive-table'), 2, "two tables should be rendered");
          test.length($('.reactive-table:nth-of-type(1) tbody tr'), 5, "the first table should have 5 rows");
          test.length($('.reactive-table:nth-of-type(2) tbody tr'), 2, "the second table should have 2 rows");
        }
      );
    }
  );
});

testAsyncMulti('Multiple tables - sorting', [function (test, expect) {
  var table1 = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows, settings: {group: _.uniqueId()}},
    document.body
  );
  var table2 = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows, settings: {group: _.uniqueId()}},
    document.body
  );
  test.equal($('.reactive-table:nth-of-type(1) tbody tr:first-child td:first-child').text(), "Ada Lovelace", "first table sorted ascending");
  test.equal($('.reactive-table:nth-of-type(2) tbody tr:first-child td:first-child').text(), "Ada Lovelace", "second table sorted ascending");

  var expectSecondTableDescending = expect(function () {
    test.equal($('.reactive-table:nth-of-type(1) tbody tr:first-child td:first-child').text(), "Ada Lovelace", "first table sorted ascending");
    test.equal($('.reactive-table:nth-of-type(2) tbody tr:first-child td:first-child').text(), "Nikola Tesla", "second table sorted descending");
    Blaze.remove(table1);
    Blaze.remove(table2);
  });

  $('.reactive-table:nth-of-type(2) th:first-child').click();
  Meteor.setTimeout(expectSecondTableDescending, 0);
}]);

testAsyncMulti('Multiple tables - filtering', [function (test, expect) {
  var group = _.uniqueId();
  var table1 = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows, settings: {group: group}},
    document.body
  );
  var table2 = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows, settings: {group: _.uniqueId()}},
    document.body
  );
  test.length($('.reactive-table:nth-of-type(1) tbody tr'), 6, "first table should have 6 rows");
  test.length($('.reactive-table:nth-of-type(2) tbody tr'), 6, "second table should have 6 rows");

  var expectFirstTableFiltered = expect(function () {
    test.length($('.reactive-table:nth-of-type(1) tbody tr'), 1, "first table should have 1 row");
    test.length($('.reactive-table:nth-of-type(2) tbody tr'), 6, "second table should have 6 rows");
    Blaze.remove(table1);
    Blaze.remove(table2);
  });

  $('.reactive-table-filter[reactive-table-group="' + group + '"] input').val("carl");
  $('.reactive-table-filter[reactive-table-group="' + group + '"] input').trigger('input');
  Meteor.setTimeout(expectFirstTableFiltered, 1000);
}]);

testAsyncMulti('Multiple tables - pagination', [function (test, expect) {
  var group1 = _.uniqueId();
  var table1 = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows, settings: {rowsPerPage: 2, group: group1}},
    document.body
  );
  var group2 = _.uniqueId()
  var table2 = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows, settings: {rowsPerPage: 2, group: group2}},
    document.body
  );
  test.equal($('.reactive-table-navigation[reactive-table-group="' + group1 + '"] .page-number input').val(), "1", "first table on page 1");
  test.equal($('.reactive-table-navigation[reactive-table-group="' + group2 + '"] .page-number input').val(), "1", "second table on page 1");

  var expectSecondTablePageTwo = expect(function () {
    test.equal($('.reactive-table-navigation[reactive-table-group="' + group1 + '"] .page-number input').val(), "1", "first table on page 1");
    test.equal($('.reactive-table-navigation[reactive-table-group="' + group2 + '"] .page-number input').val(), "2", "second table on page 2");
    Blaze.remove(table1);
    Blaze.remove(table2);
  });

  $('.reactive-table-navigation[reactive-table-group="' + group2 + '"] .next-page').click();
  Meteor.setTimeout(expectSecondTablePageTwo, 0);
}]);
