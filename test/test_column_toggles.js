Tinytest.add('Column Toggles - setting', function (test) {
  testTable(
    {
      collection: rows,
      settings: {
        showColumnToggles: false
      }
    },
    function () {
      test.length($('.reactive-table-columns-dropdown'), 0, "column toggle button should be hidden");
    }
  );

  testTable(
    {
      collection: rows,
      showColumnToggles: true
    },
    function () {
      test.length($('.reactive-table-columns-dropdown'), 1, "column toggle button should be visible");
      test.length($('.reactive-table th'), 2, "two columns should be displayed");
      test.length($('.reactive-table-columns-dropdown input:checked'), 2, "two checked boxes should be available");
    }
  );
});

Tinytest.add('Column Toggles - hidden columns', function (test) {
  testTable(
    {
      collection: rows,
      settings: {
        showColumnToggles: true,
        fields: [
          {key: 'name', label: 'Visible'},
          {key: 'score', label: 'Hidden', hidden: true}
        ]
      }
    },
    function () {
      test.length($('.reactive-table-columns-dropdown'), 1, "column toggle button should be visible");
      test.length($('.reactive-table th'), 1, "one column should be displayed");
      test.length($('.reactive-table-columns-dropdown input'), 2, "two checkboxes should be available");
      test.length($('.reactive-table-columns-dropdown input:checked'), 1, "only one box should be checked");
    }
  );
});

Tinytest.add('Column Toggles - hidden columns with non-unique names', function (test) {
  /**
   * Tests expected erroneous column visibility behaviour if table has duplicate field keys
   */
  testTable(
    {
      collection: rows,
      settings: {
        showColumnToggles: true,
        fields: [
          {key: 'name', label: 'Visible'},
          {key: 'name', label: 'Hidden', hidden: true}
        ]
      }
    },
    function () {
      test.length($('.reactive-table-columns-dropdown'), 1, "column toggle button should be visible");
      test.length($('.reactive-table th'), 2, "two columns should be displayed");
      test.length($('.reactive-table-columns-dropdown input'), 2, "two checkboxes should be available");
      test.length($('.reactive-table-columns-dropdown input:checked'), 2, "both boxes should be checked");
    }
  );

  testTable(
    {
      collection: rows,
      settings: {
        showColumnToggles: true,
        fields: [
          {key: 'name', label: 'Hidden', hidden: true},
          {key: 'name', label: 'Visible'}
        ]
      }
    },
    function () {
      test.length($('.reactive-table-columns-dropdown'), 1, "column toggle button should be visible");
      test.length($('.reactive-table th'), 0, "no columns should be displayed");
      test.length($('.reactive-table-columns-dropdown input'), 2, "two checkboxes should be available");
      test.length($('.reactive-table-columns-dropdown input:checked'), 0, "no boxes should be checked");
    }
  );

});

testAsyncMulti('Column Toggles - toggling', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {
      collection: rows,
      showColumnToggles: true,
      fields: [
        {key: 'name', label: 'Visible'},
        {key: 'score', label: 'Hidden', hidden: true}
      ]
    },
    document.body
  );
  test.length($('.reactive-table th'), 1, "one column should be displayed");
  test.length($('.reactive-table-columns-dropdown input'), 2, "two checkboxes should be available");
  test.length($('.reactive-table-columns-dropdown input:checked'), 1, "only one box should be checked");

  var expectSecondColumnOnly = expect(function () {
    test.length($('.reactive-table th'), 1, "one column should be displayed");
    test.length($('.reactive-table-columns-dropdown input'), 2, "two checkboxes should be available");
    test.length($('.reactive-table-columns-dropdown input:checked'), 1, "only one box should be checked");
    test.length($('.reactive-table th:first-child').text().trim().match(/Hidden/), 1, "initially hidden column should now be displayed");

    Blaze.remove(table);
  });

  var expectBothColumns = expect(function () {
    test.length($('.reactive-table th'), 2, "two columns should be displayed");
    test.length($('.reactive-table-columns-dropdown input'), 2, "both boxes should be checked");
    test.length($('.reactive-table th:first-child').text().trim().match(/Visible/), 1, "visible column should still be displayed");
    test.length($('.reactive-table th:nth-child(2)').text().trim().match(/Hidden/), 1, "initially hidden column should now be displayed");

    $('.reactive-table-columns-dropdown input[key="name"]').click();
    Meteor.setTimeout(expectSecondColumnOnly, 0);
  });

  $('.reactive-table-columns-dropdown input[key="score"]').click();
  Meteor.setTimeout(expectBothColumns, 0);
}]);
