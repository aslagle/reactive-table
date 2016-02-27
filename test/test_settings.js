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


Tinytest.add('Settings - showRowCount', function (test) {
  testTable(
    {
      collection: rows,
      settings: {
        showNavigation: 'always',
        showNavigationRowsPerPage: true,
      }
    },
    function () {
      test.length($('.reactive-table-navigation .rows-per-page .rows-per-page-count'), 0, "row count should be hidden");
    }
  );

  testTable(
    {
      collection: rows,
      settings: {
        showNavigation: 'always',
        showNavigationRowsPerPage: true,
        showRowCount: true
      }
    },
    function () {
      test.length($('.reactive-table-navigation .rows-per-page .rows-per-page-count'), 1, "row count should be visible");
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

  // simulate fontawesome installation
  Package['fortawesome:fontawesome'] = true;

  testTable(
    {collection: rows},
    function () {
      test.length($('.reactive-table-filter .fa'), 1, "font awesome should be on");
    }
  );

  testTable(
    {collection: rows, useFontAwesome: false},
    function () {
      test.length($('.reactive-table-filter .fa'), 0, "font awesome should be off");
    }
  );

  delete Package['fortawesome:fontawesome'];
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

testAsyncMulti('Settings - noDataTmpl', [function (test, expect) {
  var collection = new Mongo.Collection();
  var id;

  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: collection, noDataTmpl: Template.noData, fields: ['name', 'score']},
    document.body
  );

  var expectNoData = expect(function () {
    test.length($('.no-data'), 1, "no data template should be rendered");
    test.length($('.reactive-table'), 0, "table should not be rendered");

    Blaze.remove(table);
  });

  var expectFilteredToNoData = expect(function () {
    test.length($('.no-data'), 1, "no data template should be rendered");
    test.length($('.reactive-table'), 0, "table should not be rendered");

    collection.remove(id);
    Meteor.setTimeout(expectNoData, 0);
  })

  var expectTable = expect(function () {
    test.length($('.no-data'), 0, "no data template should not be rendered");
    test.length($('.reactive-table tbody tr'), 1, "second page should have one rows");

    $('.reactive-table-filter input').val('g');
    $('.reactive-table-filter input').trigger('input');
    Meteor.setTimeout(expectFilteredToNoData, 1000);
  });

  test.length($('.no-data'), 1, "no data template should be rendered");
  test.length($('.reactive-table'), 0, "table should not be rendered");

  id = collection.insert({name: 'Ada Lovelace', score: 5});
  Meteor.setTimeout(expectTable, 0);
}]);

testAsyncMulti('Settings - currentPage var updates table', [function (test, expect) {
  var page = new ReactiveVar(0);

  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows, settings: {rowsPerPage: 2, currentPage: page}},
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

    page.set(0);
    Meteor.setTimeout(expectFirstPage, 0);
  });

  var expectLastPage = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Marie Curie", "should be on last page");
    test.length($('.reactive-table tbody tr'), 2, "last page should have two rows");
    test.equal($('.reactive-table-navigation .page-number input').val(), "3", "displayed page number should be 3");

    page.set(1);
    Meteor.setTimeout(expectSecondPage, 0);
  });

  page.set(2);
  Meteor.setTimeout(expectLastPage, 0);
}]);

testAsyncMulti('Settings - currentPage var updates table with server-side collection', [function (test, expect) {
  var page = new ReactiveVar(0);

  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: "collection", fields: ["name"], settings: {rowsPerPage: 2, currentPage: page}},
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

    page.set(0);
    Meteor.setTimeout(expectFirstPage, 500);
  });

  var expectLastPage = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Marie Curie", "should be on last page");
    test.length($('.reactive-table tbody tr'), 2, "last page should have two rows");
    test.equal($('.reactive-table-navigation .page-number input').val(), "3", "displayed page number should be 3");

    page.set(1);
    Meteor.setTimeout(expectSecondPage, 500);
  });

  page.set(2);
  Meteor.setTimeout(expectLastPage, 500);
}]);

testAsyncMulti('Settings - currentPage var updated from table changes', [function (test, expect) {
  var page = new ReactiveVar(0);

  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows, settings: {rowsPerPage: 2, currentPage: page}},
    document.body
  );

  var expectFirstPage = expect(function () {
    test.equal(page.get(), 0, "should be on first page");

    Blaze.remove(table);
  });

  var expectSecondPage = expect(function () {
    test.equal(page.get(), 1, "should be on second page");

    $('.reactive-table-navigation .page-number input').val("1");
    $('.reactive-table-navigation .page-number input').trigger("change");
    Meteor.setTimeout(expectFirstPage, 0);
  });

  var expectLastPage = expect(function () {
    test.equal(page.get(), 2, "should be on last page");

    $('.reactive-table-navigation .page-number input').val('2');
    $('.reactive-table-navigation .page-number input').trigger("change");
    Meteor.setTimeout(expectSecondPage, 0);
  });

  $('.reactive-table-navigation .page-number input').val("3");
  $('.reactive-table-navigation .page-number input').trigger("change");
  Meteor.setTimeout(expectLastPage, 0);
}]);

testAsyncMulti('Settings - rowsPerPage var updates table', [function (test, expect) {
  var rowsPerPage = new ReactiveVar(5);

  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows, settings: {rowsPerPage: rowsPerPage}},
    document.body
  );

  var expectThreeRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 3, "three rows should be rendered");

    Blaze.remove(table);
  });

  var expectFiveRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 5, "five rows should be rendered");

    rowsPerPage.set(3);
    Meteor.setTimeout(expectThreeRows, 0);
  });

  Meteor.setTimeout(expectFiveRows, 0);
}]);

testAsyncMulti('Settings - rowsPerPage var updates table with server-side collection', [function (test, expect) {
  var rowsPerPage = new ReactiveVar(5);

  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: "collection", fields: ["name"], settings: {rowsPerPage: rowsPerPage}},
    document.body
  );

  var expectThreeRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 3, "three rows should be rendered");

    Blaze.remove(table);
  });

  var expectFiveRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 5, "five rows should be rendered");

    rowsPerPage.set(3);
    Meteor.setTimeout(expectThreeRows, 500);
  });

  Meteor.setTimeout(expectFiveRows, 500);
}]);

testAsyncMulti('Settings - rowsPerPage var updated from table changes', [function (test, expect) {
  var rowsPerPage = new ReactiveVar(5);

  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: rows, settings: {rowsPerPage: rowsPerPage}},
    document.body
  );

  var expectThreeRows = expect(function () {
    test.equal(rowsPerPage.get(), 3, "three rows should be rendered");

    Blaze.remove(table);
  });

  $('.reactive-table-navigation .rows-per-page input').val(3);
  $('.reactive-table-navigation .rows-per-page input').trigger('change');
  Meteor.setTimeout(expectThreeRows, 0);
}]);
