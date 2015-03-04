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

Tinytest.add('Column Toggles - hidden columns with non-unique keys', function (test) {
  /**
   * Tests legacy behaviour of duplicate key values without specifying a fieldId
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
      test.length($('.reactive-table th'), 1, "one columns should be displayed");
      test.length($('.reactive-table-columns-dropdown input'), 2, "two checkboxes should be available");
      test.length($('.reactive-table-columns-dropdown input:checked'), 1, "one box should be checked");
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
      test.length($('.reactive-table th'), 1, "one column should be displayed");
      test.length($('.reactive-table-columns-dropdown input'), 2, "two checkboxes should be available");
      test.length($('.reactive-table-columns-dropdown input:checked'), 1, "one box should be checked");
    }
  );

});

Tinytest.add('Column Toggles - hidden columns with fieldIds', function (test) {
  testTable(
    {
      collection: rows,
      settings: {
        showColumnToggles: true,
        fields: [
          {fieldId: 'one', key: 'name', label: 'Visible'},
          {fieldId: 'two', key: 'score', label: 'Hidden', hidden: true}
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

    $('.reactive-table-columns-dropdown input[data-fieldid="0"]').click();
    Meteor.setTimeout(expectSecondColumnOnly, 0);
  });

  $('.reactive-table-columns-dropdown input[data-fieldid="1"]').click();
  Meteor.setTimeout(expectBothColumns, 0);
}]);

testAsyncMulti('Column Toggles - toggling after adding new columns with fieldId', [function (test, expect) {
  var insert2ndField = new ReactiveVar(false);
  Template.testReactivity.helpers({
    collection: function () {
      return collection;
    },
    settings: function () {
      if (insert2ndField.get()) {
        return {
          showColumnToggles: true,
          fields: [
            {fieldId: 'one', key: 'name', label: 'Name'},
            {fieldId: 'two', key: 'score', label: 'Score'},
            {fieldId: 'three', key: 'average', label: 'Average'}
           ]
        }
      } else {
        return {
          showColumnToggles: true,
          fields: [
            {fieldId: 'one', key: 'name', label: 'Name'},
            {fieldId: 'three', key: 'average', label: 'Average'}
          ]
        }
      }
    }
  });

  var table = Blaze.renderWithData(
    Template.testReactivity,
    {},
    document.body
  );

  test.length($('.reactive-table th'), 2, "two columns should be displayed");
  test.length($('.reactive-table-columns-dropdown input'), 2, "two checkboxes should be available");
  test.length($('.reactive-table-columns-dropdown input:checked'), 2, "both boxes should be checked");

  var expectColumnsOneAndTwoOnly = expect(function () {
    test.length($('.reactive-table th'), 2, "two columns should be displayed");
    test.length($('.reactive-table-columns-dropdown input'), 3, "three checkboxes should be available");
    test.length($('.reactive-table-columns-dropdown input:checked'), 2, "two checkboxes box should be checked");
    test.length($('.reactive-table-columns-dropdown input:checked[data-fieldid="two"]'), 1, "newly inserted field should be checked");
    test.length($('.reactive-table-columns-dropdown input:checked[data-fieldid="three"]'), 0, "previously hidden field should still be unchecked");
    test.length($('.reactive-table th:first-child').text().trim().match(/Name/), 1, "Name column should still be visible");
    test.length($('.reactive-table th:nth-child(2)').text().trim().match(/Score/), 1, "Score column should now be visible");

    Blaze.remove(table);
  });

  var expectOneColumnOnly = expect(function () {
    test.length($('.reactive-table th'), 1, "one columns should be displayed");
    test.length($('.reactive-table-columns-dropdown input:checked'), 1, "one box should be checked");
    test.length($('.reactive-table th:first-child').text().trim().match(/Name/), 1, "visible column should still be displayed");

    insert2ndField.set(true);
    Meteor.setTimeout(expectColumnsOneAndTwoOnly, 0);
  });

  $('.reactive-table-columns-dropdown input[data-fieldid="three"]').click();
  Meteor.setTimeout(expectOneColumnOnly, 0);
}]);

testAsyncMulti('Column Toggles - toggling after adding new columns without fieldIds', [function (test, expect) {
  var insert2ndField = new ReactiveVar(false);
  Template.testReactivity.helpers({
    collection: function () {
      return collection;
    },
    settings: function () {
      if (insert2ndField.get()) {
        return {
          showColumnToggles: true,
          fields: [
            {key: 'name', label: 'Name'},
            {key: 'score', label: 'Score'},
            {key: 'average', label: 'Average'}
           ]
        }
      } else {
        return {
          showColumnToggles: true,
          fields: [
            {key: 'name', label: 'Name'},
            {key: 'average', label: 'Average'}
          ]
        }
      }
    }
  });

  var table = Blaze.renderWithData(
    Template.testReactivity,
    {},
    document.body
  );

  test.length($('.reactive-table th'), 2, "two columns should be displayed");
  test.length($('.reactive-table-columns-dropdown input'), 2, "two checkboxes should be available");
  test.length($('.reactive-table-columns-dropdown input:checked'), 2, "both boxes should be checked");

  var expectColumnsOneAndTwoOnly = expect(function () {
    test.length($('.reactive-table th'), 2, "two columns should be displayed");
    test.length($('.reactive-table-columns-dropdown input'), 3, "three checkboxes should be available");
    test.length($('.reactive-table-columns-dropdown input:checked'), 2, "two checkboxes box should be checked");
    test.length($('.reactive-table th:first-child').text().trim().match(/Name/), 1, "Name column should still be visible");

    // Tests for known erroneous behaviour in this case if fieldIds are not explicitly set:
    test.length($('.reactive-table-columns-dropdown input:checked[data-fieldid="1"]'), 0, "newly inserted field will be unchecked");
    test.length($('.reactive-table th:nth-child(2)').text().trim().match(/Average/), 1, "Average column will still be visible");

    Blaze.remove(table);
  });

  var expectOneColumnOnly = expect(function () {
    test.length($('.reactive-table th'), 1, "one columns should be displayed");
    test.length($('.reactive-table-columns-dropdown input:checked'), 1, "one box should be checked");
    test.length($('.reactive-table th:first-child').text().trim().match(/Name/), 1, "visible column should still be displayed");

    insert2ndField.set(true);
    Meteor.setTimeout(expectColumnsOneAndTwoOnly, 0);
  });

  $('.reactive-table-columns-dropdown input[data-fieldid="1"]').click();
  Meteor.setTimeout(expectOneColumnOnly, 0);
}]);

Tinytest.add('Column Toggles - hideToggle option', function (test) {
  testTable(
    {
      collection: rows,
      settings: {
        showColumnToggles: true,
        fields: [
          {key: 'name', hideToggle: false},
          {key: 'score', hideToggle: true}
        ]
      }
    },
    function () {
      test.length($('.reactive-table-columns-dropdown'), 1, "column toggle button should be visible");
      test.length($('.reactive-table th'), 2, "two columns should be displayed");
      test.length($('.reactive-table-columns-dropdown input'), 1, "one checkbox should be available");
      test.length($('.reactive-table-columns-dropdown input:checked'), 1, "one box should be checked");
    }
  );
});
