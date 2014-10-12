Tinytest.add('Settings - showFilter', function (test) {
  testTable(
    {collection: rows, group: _.uniqueId()},
    function () {
      test.length($('.reactive-table-filter'), 1, "filter should be visible by default");
    }
  );

  testTable(
    {collection: rows, settings: {showFilter: false, group: _.uniqueId()}},
    function () {
      test.length($('.reactive-table-filter'), 0, "filter should be hidden");
    }
  );

  testTable(
    {collection: rows, settings: {showFilter: true, group: _.uniqueId()}},
    function () {
      test.length($('.reactive-table-filter'), 1, "filter should be visible");
    }
  );
});

Tinytest.add('Settings - rowsPerPage', function (test) {
  testTable(
    {collection: rows, settings: {rowsPerPage: 2, group: _.uniqueId()}},
    function () {
      test.length($('.reactive-table tbody tr'), 2, "two rows should be rendered");
    }
  );

  testTable(
    {collection: rows, settings: {rowsPerPage: 1, group: _.uniqueId()}},
    function () {
      test.length($('.reactive-table tbody tr'), 1, "one row should be rendered");
    }
  );
});

Tinytest.add('Settings - showNavigation', function (test) {
  testTable(
    {collection: rows, group: _.uniqueId()},
    function () {
      test.length($('.reactive-table-navigation'), 1, "navigation should be visible by default");
    }
  );

  testTable(
    {collection: rows, settings: {showNavigation: 'never', group: _.uniqueId()}},
    function () {
      test.length($('.reactive-table-navigation'), 0, "navigation should be hidden");
    }
  );

  testTable(
    {collection: rows, settings: {showNavigation: 'always', group: _.uniqueId()}},
    function () {
      test.length($('.reactive-table-navigation'), 1, "navigation should be visible");
    }
  );

  testTable(
    {collection: rows, settings: {showNavigation: 'auto', group: _.uniqueId()}},
    function () {
      test.length($('.reactive-table-navigation'), 0, "navigation should be hidden");
    }
  );

  testTable(
    {collection: rows, settings: {showNavigation: 'auto', rowsPerPage: 2, group: _.uniqueId()}},
    function () {
      test.length($('.reactive-table-navigation'), 1, "navigation should be visible");
    }
  );
});


Tinytest.add('Settings - showNavigationRowsPerPage', function (test) {
  testTable(
    {
      collection: rows,
      settings: {
        showNavigation: 'never',
        showNavigationRowsPerPage: true,
        group: _.uniqueId()
      }
    },
    function () {
      test.length($('.reactive-table-navigation'), 0, "navigation should be hidden");
    }
  );

  testTable(
    {
      collection: rows,
      settings: {
        showNavigation: 'always',
        showNavigationRowsPerPage: true,
        group: _.uniqueId()
      }
    },
    function () {
      test.length($('.reactive-table-navigation .rows-per-page'), 1, "rows per page should be visible");
    }
  );

  testTable(
    {
      collection: rows,
      settings: {
        showNavigation: 'always',
        showNavigationRowsPerPage: false,
        group: _.uniqueId()
      }
    },
    function () {
      test.length($('.reactive-table-navigation'), 1, "navigation should be visible");
      test.length($('.reactive-table-navigation .rows-per-page'), 0, "rows per page should be hidden");
    }
  );
});

Tinytest.add('Settings - useFontAwesome', function (test) {
  testTable(
    {collection: rows, settings: {group: _.uniqueId()}},
    function () {
      test.length($('.reactive-table-filter .fa'), 0, "font awesome should be off by default");
    }
  );

  testTable(
    {collection: rows, settings: {useFontAwesome: true, group: _.uniqueId()}},
    function () {
      test.length($('.reactive-table-filter .fa'), 1, "font awesome should be on");
    }
  );

  testTable(
    {collection: rows, settings: {useFontAwesome: false, group: _.uniqueId()}},
    function () {
      test.length($('.reactive-table-filter .fa'), 0, "font awesome should be off");
    }
  );
});

Tinytest.add('Settings - rowClass', function (test) {
  testTable(
    {collection: rows, settings: {rowClass: 'row-class', group: _.uniqueId()}},
    function () {
      test.length($('.reactive-table tbody tr.row-class'), $('.reactive-table tbody tr').length, "all rows should have the class");
    }
  );

  testTable(
    {
      collection: rows,
      settings: {
        rowClass: function (row) {
          return 'row-class-' + row.score;
        },
        group: _.uniqueId()
      }
    },
    function () {
      test.length($('.reactive-table tbody tr.row-class-10'), 1, "1 row should have this class");
      test.length($('.reactive-table tbody tr.row-class-5'), 3, "3 rows should have this class");
    }
  );
});

Tinytest.add('Settings - class', function (test) {
  testTable(
    {collection: rows, settings: {group: _.uniqueId()}},
    function () {
      test.length($('.reactive-table.table.table-striped.table-hover'), 1, "table should have default classes");
    }
  );

  testTable(
    {collection: rows, class: 'table-class', settings: {group: _.uniqueId()}},
    function () {
      test.length($('.reactive-table.table-class'), 1, "table should have the class");
    }
  );
});
