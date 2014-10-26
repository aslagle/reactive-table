Tinytest.add('Settings - showFilter', function (test) {
  testTable(
    {collection: rows},
    function () {
      test.length($('.reactive-table-filter'), 1, "filter should be visible by default");
    }
  );

  testTable(
    {collection: rows, settings: {showFilter: false}},
    function () {
      test.length($('.reactive-table-filter'), 0, "filter should be hidden");
    }
  );

  testTable(
    {collection: rows, settings: {showFilter: true}},
    function () {
      test.length($('.reactive-table-filter'), 1, "filter should be visible");
    }
  );

  testTable(
    {collection: rows, showFilter: false},
    function () {
      test.length($('.reactive-table-filter'), 0, "filter should be hidden");
    }
  );
});

Tinytest.add('Settings - rowsPerPage', function (test) {
  testTable(
    {collection: rows, settings: {rowsPerPage: 2}},
    function () {
      test.length($('.reactive-table tbody tr'), 2, "two rows should be rendered");
    }
  );

  testTable(
    {collection: rows, settings: {rowsPerPage: 1}},
    function () {
      test.length($('.reactive-table tbody tr'), 1, "one row should be rendered");
    }
  );

  testTable(
    {collection: rows, rowsPerPage: 2},
    function () {
      test.length($('.reactive-table tbody tr'), 2, "two rows should be rendered");
    }
  );
});

Tinytest.add('Settings - showNavigation', function (test) {
  testTable(
    {collection: rows},
    function () {
      test.length($('.reactive-table-navigation'), 1, "navigation should be visible by default");
    }
  );

  testTable(
    {collection: rows, settings: {showNavigation: 'never'}},
    function () {
      test.length($('.reactive-table-navigation'), 0, "navigation should be hidden");
    }
  );

  testTable(
    {collection: rows, settings: {showNavigation: 'always'}},
    function () {
      test.length($('.reactive-table-navigation'), 1, "navigation should be visible");
    }
  );

  testTable(
    {collection: rows, settings: {showNavigation: 'auto'}},
    function () {
      test.length($('.reactive-table-navigation'), 0, "navigation should be hidden");
    }
  );

  testTable(
    {collection: rows, settings: {showNavigation: 'auto', rowsPerPage: 2}},
    function () {
      test.length($('.reactive-table-navigation'), 1, "navigation should be visible");
    }
  );

  testTable(
    {collection: rows, showNavigation: 'never'},
    function () {
      test.length($('.reactive-table-navigation'), 0, "navigation should be hidden");
    }
  );
});


Tinytest.add('Settings - showNavigationRowsPerPage', function (test) {
  testTable(
    {
      collection: rows,
      settings: {
        showNavigation: 'never',
        showNavigationRowsPerPage: true
      }
    },
    function () {
      test.length($('.reactive-table-navigation'), 0, "navigation should be hidden");
    }
  );

  testTable(
    {
      collection: rows,
      showNavigation: 'always',
      showNavigationRowsPerPage: true
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
        showNavigationRowsPerPage: false
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
    {collection: rows},
    function () {
      test.length($('.reactive-table-filter .fa'), 0, "font awesome should be off by default");
    }
  );

  testTable(
    {collection: rows, settings: {useFontAwesome: true}},
    function () {
      test.length($('.reactive-table-filter .fa'), 1, "font awesome should be on");
    }
  );

  testTable(
    {collection: rows, settings: {useFontAwesome: false}},
    function () {
      test.length($('.reactive-table-filter .fa'), 0, "font awesome should be off");
    }
  );

  testTable(
    {collection: rows, useFontAwesome: true},
    function () {
      test.length($('.reactive-table-filter .fa'), 1, "font awesome should be on");
    }
  );
});

Tinytest.add('Settings - rowClass', function (test) {
  testTable(
    {collection: rows, settings: {rowClass: 'row-class'}},
    function () {
      test.length($('.reactive-table tbody tr.row-class'), $('.reactive-table tbody tr').length, "all rows should have the class");
    }
  );

  testTable(
    {collection: rows, rowClass: 'row-class'},
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
        }
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
    {collection: rows},
    function () {
      test.length($('.reactive-table.table.table-striped.table-hover'), 1, "table should have default classes");
    }
  );

  testTable(
    {collection: rows, class: 'table-class'},
    function () {
      test.length($('.reactive-table.table-class'), 1, "table should have the class");
    }
  );

  testTable(
    {collection: rows, settings: {class: 'table-class'}},
    function () {
      test.length($('.reactive-table.table-class'), 1, "table should have the class");
    }
  );
});

Tinytest.add('Settings - id', function (test) {
  testTable(
    {collection: rows},
    function () {
      test.equal($('.reactive-table').attr('id').slice(0, 15), 'reactive-table-', "table should have default id");
    }
  );

  testTable(
    {collection: rows, id: 'unique-table'},
    function () {
      test.length($('#unique-table.reactive-table'), 1, "table should have the id");
    }
  );

  testTable(
    {collection: rows, settings: {id: 'unique-table-2'}},
    function () {
      test.length($('#unique-table-2.reactive-table'), 1, "table should have the id");
    }
  );
});
