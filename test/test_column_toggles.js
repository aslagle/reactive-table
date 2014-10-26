Tinytest.add('Column Toggles - setting', function (test) {
  testTable(
    {
      collection: rows,
      settings: {
        showColumnToggles: false
      }
    },
    function () {
      test.length($('.reactive-table-add-column'), 0, "column toggle button should be hidden");
    }
  );

  testTable(
    {
      collection: rows,
      showColumnToggles: true
    },
    function () {
      test.length($('.reactive-table-add-column'), 1, "column toggle button should be visible");
      test.length($('.reactive-table th'), 3, "two columns + toggle button should be displayed");
      test.length($('.reactive-table-add-column input:checked'), 2, "two checked boxes should be available");
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
          {key: 'name', label: 'Hidden', hidden: true}
        ]
      }
    },
    function () {
      test.length($('.reactive-table-add-column'), 1, "column toggle button should be visible");
      test.length($('.reactive-table th'), 2, "one column + toggle button should be displayed");
      test.length($('.reactive-table-add-column input'), 2, "two checkboxes should be available");
      test.length($('.reactive-table-add-column input:checked'), 1, "only one box should be checked");
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
        {key: 'name', label: 'Hidden', hidden: true}
      ]
    },
    document.body
  );
  test.length($('.reactive-table th'), 2, "one column + toggle button should be displayed");
  test.length($('.reactive-table-add-column input'), 2, "two checkboxes should be available");
  test.length($('.reactive-table-add-column input:checked'), 1, "only one box should be checked");

  var expectSecondColumnOnly = expect(function () {
    test.length($('.reactive-table th'), 2, "one column + toggle button should be displayed");
    test.length($('.reactive-table-add-column input'), 2, "two checkboxes should be available");
    test.length($('.reactive-table-add-column input:checked'), 1, "only one box should be checked");
    test.length($('.reactive-table th:first-child').text().trim().match(/Hidden/), 1, "initially hidden column should now be displayed");

    Blaze.remove(table);
  });

  var expectBothColumns = expect(function () {
    test.length($('.reactive-table th'), 3, "two columns + toggle button should be displayed");
    test.length($('.reactive-table-add-column input'), 2, "both boxes should be checked");
    test.length($('.reactive-table th:first-child').text().trim().match(/Visible/), 1, "visible column should still be displayed");
    test.length($('.reactive-table th:nth-child(2)').text().trim().match(/Hidden/), 1, "initially hidden column should now be displayed");

    $('.reactive-table-add-column input[index=0]').click();
    Meteor.setTimeout(expectSecondColumnOnly, 0);
  });

  $('.reactive-table-add-column input[index=1]').click();
  Meteor.setTimeout(expectBothColumns, 0);
}]);
