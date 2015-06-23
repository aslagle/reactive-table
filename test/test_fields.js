Tinytest.add('Fields - implicit', function (test) {
  testTable(
    {collection: rows},
    function () {
      test.length($('.reactive-table th'), 2, "two columns should be rendered");
      test.length($('.reactive-table th:first-child').text().trim().match(/^name/), 1, "first column should be name");
      test.length($('.reactive-table th:nth-child(2)').text().trim().match(/^score/), 1, "second column should be score");
    }
  );
});

Tinytest.add('Fields - array', function (test) {
  testTable(
    {collection: rows, fields: ['name', 'score']},
    function () {
      test.length($('.reactive-table th'), 2, "two columns should be rendered");
      test.length($('.reactive-table th:first-child').text().trim().match(/^name/), 1, "first column should be name");
      test.length($('.reactive-table th:nth-child(2)').text().trim().match(/^score/), 1, "second column should be score");
    }
  );

  testTable(
    {collection: rows, settings: {fields: ['score']}},
    function () {
      test.length($('.reactive-table th'), 1, "one columns should be rendered");
      test.length($('.reactive-table th:first-child').text().trim().match(/^score/), 1, "column should be score");
    }
  );
});

Tinytest.add('Fields - array with non-unique keys', function (test) {
  testTable(
    {collection: rows, fields: ['name', 'name']},
    function () {
      test.length($('.reactive-table th'), 2, "two columns should be rendered");
      test.length($('.reactive-table th:first-child').text().trim().match(/^name/), 1, "first column should be name");
      test.length($('.reactive-table th:nth-child(2)').text().trim().match(/^name/), 1, "second column should be name also");
    }
  );
});

Tinytest.add('Fields - fieldIds', function (test) {
  testTable(
    {
      collection: rows,
      settings: {
        fields: [
          {fieldId: 'one', key: 'name', label: 'Name'},
          {fieldId: 'two', key: 'score', label: 'Score'}
        ]
      }
    },
    function () {
      test.length($('.reactive-table th'), 2, "two columns should be rendered");
      test.length($('.reactive-table th:first-child').text().trim().match(/^Name/), 1, "first column should be name");
      test.length($('.reactive-table th:nth-child(2)').text().trim().match(/^Score/), 1, "second column should be score");
    }
  );
});

Tinytest.add('Fields - erroneous fieldIds', function (test) {
  testTable(
    {
      collection: rows,
      settings: {
        fields: [
          {fieldId: 'one', key: 'name'},
          {fieldId: 'one', key: 'score'}
        ]
      }
    },
    function () {
      test.length($('.reactive-table th'), 0, "no columns should be rendered");
    }
  );

  // If one field specifies fieldId, all fields must specify a fieldId
  testTable(
    {
      collection: rows,
      settings: {
        fields: [
          {key: 'name'},
          {fieldId: 'two', key: 'score'}
        ]
      }
    },
    function () {
      test.length($('.reactive-table th'), 0, "no columns should be rendered");
    }
  );
});

Tinytest.add('Fields - label string', function (test) {
  testTable(
    {
      collection: rows,
      settings: {
        fields: [
          {key: 'name', label: 'Column1'},
          {key: 'score', label: 'Column2'}
        ]
      }
    },
    function () {
      test.length($('.reactive-table th'), 2, "two columns should be rendered");
      test.length($('.reactive-table th:first-child').text().trim().match(/^Column1/), 1, "first column label");
      test.length($('.reactive-table th:nth-child(2)').text().trim().match(/^Column2/), 1, "second column label");
      test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "first column content");
      test.equal($('.reactive-table tbody tr:first-child td:nth-child(2)').text(), "5", "second column content");
    }
  );
});

Tinytest.add('Fields - label function', function (test) {
  testTable(
    {
      collection: rows,
      settings: {
        fields: [
          {key: 'name', label: function () { return 'Column1'; }},
          {key: 'score', label: function () { return new Spacebars.SafeString('Column2'); }}
        ]
      }
    },
    function () {
      test.length($('.reactive-table th'), 2, "two columns should be rendered");
      test.length($('.reactive-table th:first-child').text().trim().match(/^Column1/), 1, "first column label");
      test.length($('.reactive-table th:nth-child(2)').text().trim().match(/^Column2/), 1, "second column label");
      test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "first column content");
      test.equal($('.reactive-table tbody tr:first-child td:nth-child(2)').text(), "5", "second column content");
    }
  );
});

Tinytest.add('Fields - label tmpl', function (test) {
  testTable(
    {
      collection: rows,
      settings: {
        fields: [
          {key: 'name', label: Template.testFieldsTmpl, labelData: {name: 'foo', score: 10}}
        ]
      }
    },
    function () {
      test.length($('.reactive-table th'), 1, "one column should be rendered");
      test.length($('.reactive-table th:first-child span.test').text().trim().match(/^foo10/), 1, "first column label");
    }
  );
});


Tinytest.add('Fields - header class string', function (test) {
  testTable(
    {
      collection: rows,
      settings: {
        fields: [
          {key: 'name', label: 'Name', headerClass: 'name-class'},
          {key: 'score', label: 'Score', headerClass: 'score-class' }
        ]
      }
    },
    function () {
      test.length($('.reactive-table th'), 2, "two columns should be rendered");
      test.length($('.reactive-table th.name-class'), 1, "first column class");
      test.length($('.reactive-table th.score-class'), 1, "second column class");
    }
  );
});

Tinytest.add('Fields - header class function', function (test) {
  testTable(
    {
      collection: rows,
      settings: {
        fields: [
          {key: 'name', label: 'Name', headerClass: function () { return 'name-class'; }},
          {key: 'score', label: 'Score', headerClass: function () { return 'score-class'; }}
        ]
      }
    },
    function () {
      test.length($('.reactive-table th'), 2, "two columns should be rendered");
      test.length($('.reactive-table th.name-class'), 1, "first column class");
      test.length($('.reactive-table th.score-class'), 1, "second column class");
    }
  );
});

Tinytest.add('Fields - cell class string', function (test) {
  testTable(
    {
      collection: rows,
      settings: {
        fields: [
          {key: 'name', label: 'Name', cellClass: 'name-class'},
          {key: 'score', label: 'Score', cellClass: 'score-class' }
        ]
      }
    },
    function () {
      test.length($('.reactive-table th'), 2, "two columns should be rendered");
      test.length($('.reactive-table td.name-class'), 6, "first column class");
      test.length($('.reactive-table td.score-class'), 6, "second column class");
    }
  );
});

Tinytest.add('Fields - cell class function', function (test) {
  testTable(
    {
      collection: [{name: 'test', score: 5}],
      settings: {
        fields: [
          {key: 'name', label: 'Name', cellClass: function (value, object) { return value + object.score; }},
          {key: 'score', label: 'Score', cellClass: function () { return 'score-class'; }}
        ]
      }
    },
    function () {
      test.length($('.reactive-table th'), 2, "two columns should be rendered");
      test.length($('.reactive-table td.test5'), 1, "first column class");
      test.length($('.reactive-table td.score-class'), 1, "second column class");
    }
  );
});


Tinytest.add('Fields - tmpl', function (test) {
  testTable(
    {
      collection: rows,
      fields: [
        {key: 'name', label: 'Name', tmpl: Template.testFieldsTmpl}
      ]
    },
    function () {
      test.length($('.reactive-table tbody tr td span.test'), 6, "all rows should have use the template");
      test.equal($('.reactive-table tbody tr:first-child td span.test').text(), "Ada Lovelace5", "template should render values");
    }
  );
});

Tinytest.add('Fields - virtual column', function (test) {
  testTable(
    {
      collection: rows,
      settings: {
        fields: [
          {key: 'name', label: 'First Initial', fn: function (name) { return name.slice(0, 1); }}
        ]
      }
    },
    function () {
      test.equal($('.reactive-table tbody tr:first-child td').text(), "A", "table should display output of fn");
      test.equal($('.reactive-table tbody tr:nth-child(2) td').text(), "C", "table should display output of fn");
    }
  );
});

Tinytest.add('Fields - virtual column sorting', function (test) {
  testTable(
    {
      collection: rows,
      fields: [
        {key: 'name', label: 'Letters 2&3', fn: function (name) { return name.slice(1, 3); }}
      ]
    },
    function () {
      test.equal($('.reactive-table tbody tr:first-child td').text(), "ar", "table should be sorted by fn");
      test.equal($('.reactive-table tbody tr:nth-child(2) td').text(), "ar", "table should be sorted by fn");
      test.equal($('.reactive-table tbody tr:nth-child(4) td').text(), "ik", "table should be sorted by fn");
    }
  );

  testTable(
    {
      collection: rows,
      settings: {
        fields: [
          {key: 'name', label: 'Letters 2&3', sortByValue: true, fn: function (name) { return name.slice(1, 3); }}
        ]
      }
    },
    function () {
      test.equal($('.reactive-table tbody tr:first-child td').text(), "da", "table should be sorted by value");
      test.equal($('.reactive-table tbody tr:nth-child(2) td').text(), "ar", "table should be sorted by value");
      test.equal($('.reactive-table tbody tr:nth-child(4) td').text(), "ra", "table should be sorted by value");
    }
  );
});

Tinytest.add('Fields - virtual column html', function (test) {
  testTable(
    {
      collection: rows,
      fields: [
        {
          key: 'name',
          label: 'HTML',
          fn: function (name) {
            return Spacebars.SafeString("<span class='test'>" + name + "</span>");
          }
        }
      ]
    },
    function () {
      test.length($('.reactive-table tbody tr span.test'), 6, "all rows should have html class");
      test.equal($('.reactive-table tbody tr:first-child td span.test').text(), "Ada Lovelace", "table should display name in html");
    }
  );
});

Tinytest.add('Fields - sortOrder', function (test) {
  testTable(
    {
      collection: rows,
      fields: [
        {key: 'name', label: 'Name', sortOrder: 0},
        {key: 'score', label: 'Score', sortOrder: 1}
      ]
    },
    function () {
      test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "sort should be by name");
      test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Carl Friedrich Gauss", "sort should be by name");
      test.equal($('.reactive-table tbody tr:nth-child(6) td:first-child').text(), "Nikola Tesla", "sort should be by name");
    }
  );

  testTable(
    {
      collection: rows,
      fields: [
        {key: 'name', label: 'Name', sortOrder: 1},
        {key: 'score', label: 'Score', sortOrder: 0}
      ]
    },
    function () {
      test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Carl Friedrich Gauss", "sort should be by score");
      test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Ada Lovelace", "sort should be by score");
      test.equal($('.reactive-table tbody tr:nth-child(6) td:first-child').text(), "Nikola Tesla", "sort should be by score");
    }
  );
});

testAsyncMulti('Fields - sortOrder ReactiveVar', [function (test, expect) {
  var nameOrder = new ReactiveVar(0);
  var scoreOrder = new ReactiveVar(1);
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {
      collection: collection,
      fields: [
        {key: 'name', label: 'Name', sortOrder: nameOrder},
        {key: 'score', label: 'Score', sortOrder: scoreOrder}
      ]
    },
    document.body
  );
  test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "sort should be by name");
  test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Carl Friedrich Gauss", "sort should be by name");
  test.equal($('.reactive-table tbody tr:nth-child(6) td:first-child').text(), "Nikola Tesla", "sort should be by name");

  var expectSortByName = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "sort should be by name");
    test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Carl Friedrich Gauss", "sort should be by name");
    test.equal($('.reactive-table tbody tr:nth-child(6) td:first-child').text(), "Nikola Tesla", "sort should be by name");
    test.equal(nameOrder.get(), 0, 'name ReactiveVar should update');

    Blaze.remove(table);
  });

  var expectSortByScore = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Carl Friedrich Gauss", "sort should be by score");
    test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Ada Lovelace", "sort should be by score");
    test.equal($('.reactive-table tbody tr:nth-child(6) td:first-child').text(), "Nikola Tesla", "sort should be by score");

    $('.reactive-table th:first-child').click();
    Meteor.setTimeout(expectSortByName, 0);
  });

  nameOrder.set(2);
  Meteor.setTimeout(expectSortByScore, 0);
}]);

Tinytest.add('Fields - sortDirection', function (test) {
  _.each(['descending', 'desc', -1], function (sort) {
    testTable(
      {
        collection: rows,
        fields: [
          {key: 'name', label: 'Name', sortDirection: sort}
        ]
      },
      function () {
        test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Nikola Tesla", "sort should be descending");
        test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Marie Curie", "sort should be descending");
        test.equal($('.reactive-table tbody tr:nth-child(6) td:first-child').text(), "Ada Lovelace", "sort should be descending");
      }
    );
  });

  _.each(['ascending', 'asc', 1], function (sort) {
    testTable(
      {
        collection: rows,
        fields: [
          {key: 'name', label: 'Name', sortDirection: sort}
        ]
      },
      function () {
        test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "sort should be ascending");
        test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Carl Friedrich Gauss", "sort should be ascending");
        test.equal($('.reactive-table tbody tr:nth-child(6) td:first-child').text(), "Nikola Tesla", "sort should be ascending");
      }
    );
  });

  testTable(
    {
      collection: rows,
      fields: [
        {key: 'name', label: 'Name', sortOrder: 1, sortDirection: 1},
        {key: 'score', label: 'Score', sortOrder: 0, sortDirection: -1}
      ]
    },
    function () {
      test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Nikola Tesla", "sort should be descending by score");
      test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Grace Hopper", "sort should be descending by score");
      test.equal($('.reactive-table tbody tr:nth-child(6) td:first-child').text(), "Carl Friedrich Gauss", "sort should be descending by score");
    }
  );
});

testAsyncMulti('Fields - sortDirection ReactiveVar', [function (test, expect) {
  var nameDirection = new ReactiveVar(1);
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {
      collection: collection,
      fields: [
        {key: 'name', label: 'Name', sortDirection: nameDirection}
      ]
    },
    document.body
  );
  test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "sort should be ascending");
  test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Carl Friedrich Gauss", "sort should be ascending");
  test.equal($('.reactive-table tbody tr:nth-child(6) td:first-child').text(), "Nikola Tesla", "sort should be ascending");

  var expectAscending = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "sort should be ascending");
    test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Carl Friedrich Gauss", "sort should be ascending");
    test.equal($('.reactive-table tbody tr:nth-child(6) td:first-child').text(), "Nikola Tesla", "sort should be ascending");
    test.equal(nameDirection.get(), 1, 'ReactiveVar should update');

    Blaze.remove(table);
  });

  var expectDescending = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Nikola Tesla", "sort should be descending");
    test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Marie Curie", "sort should be descending");
    test.equal($('.reactive-table tbody tr:nth-child(6) td:first-child').text(), "Ada Lovelace", "sort should be descending");

    $('.reactive-table th:first-child').click();
    Meteor.setTimeout(expectAscending, 0);
  });

  nameDirection.set(-1);
  Meteor.setTimeout(expectDescending, 0);
}]);

Tinytest.add('Fields - default sort', function (test) {
  testTable(
    {
      collection: rows,
      fields: [
        {key: 'name', label: 'Name'},
        {key: 'score', label: 'Score'}
      ]
    },
    function () {
      test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "sort should be ascending by first column");
      test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Carl Friedrich Gauss", "sort should be ascending by first column");
      test.equal($('.reactive-table tbody tr:nth-child(6) td:first-child').text(), "Nikola Tesla", "sort should be ascending by first column");
    }
  );

  testTable(
    {
      collection: rows,
      fields: [
        {key: 'name', label: 'Name', sortable: false},
        {key: 'score', label: 'Score'}
      ]
    },
    function () {
      test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Carl Friedrich Gauss", "sort should be ascending by second column");
      test.equal($('.reactive-table tbody tr:nth-child(2) td:first-child').text(), "Ada Lovelace", "sort should be ascending by second column");
      test.equal($('.reactive-table tbody tr:nth-child(6) td:first-child').text(), "Nikola Tesla", "sort should be ascending by second column");
    }
  );

  testTable(
    {
      collection: rows,
      fields: [
        {key: 'name', label: 'Name', sortable: false},
        {key: 'score', label: 'Score', sortable: false}
      ]
    },
    function () {
      test.length($('.reactive-table tbody tr'), 6, "rendered table should have 6 rows");
    }
  );
});

Tinytest.add('Fields - default sort DEPRECATED', function (test) {
  _.each(['descending', 'desc', -1], function (sort) {
    testTable(
      {
        collection: rows,
        settings: {
          fields: [
            {key: 'name', label: 'Name', sort: sort}
          ]
        }
      },
      function () {
        test.equal($('.reactive-table tbody tr:first-child td').text(), "Nikola Tesla", "sort should be " + sort);
        test.equal($('.reactive-table tbody tr:nth-child(2) td').text(), "Marie Curie", "sort should be " + sort);
        test.equal($('.reactive-table tbody tr:nth-child(6) td').text(), "Ada Lovelace", "sort should be " + sort);
      }
    );
  });

  testTable(
    {
      collection: rows,
      fields: [
        {key: 'name', label: 'Name', sort: 'asc'}
      ]
    },
    function () {
      test.equal($('.reactive-table tbody tr:first-child td').text(), "Ada Lovelace", "sort should be ascending");
      test.equal($('.reactive-table tbody tr:nth-child(2) td').text(), "Carl Friedrich Gauss", "sort should be ascending");
      test.equal($('.reactive-table tbody tr:nth-child(6) td').text(), "Nikola Tesla", "sort should be ascending");
    }
  );
});

testAsyncMulti('Fields - sortable', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {
      collection: rows,
      fields: [
        {key: 'name', label: 'Name', sortable: true},
        {key: 'score', label: 'Score', sortable: false}
      ]
    },
    document.body
  );
  test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "initial first row");

  var expectDescending = expect(function () {
   test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Nikola Tesla", "first column is sortable");
   Blaze.remove(table);
  });

  var expectStillAscending = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "second column not sortable");

    $('.reactive-table th:first-child').click();
    Meteor.setTimeout(expectDescending, 0);
  });

  $('.reactive-table th:nth-child(2)').click();
  Meteor.setTimeout(expectStillAscending, 0);
}]);

Tinytest.add('Fields - nested key', function (test) {
  var nestedObjectRows = [
    {outerObject: {innerObject: 'a'}},
    {outerObject: {innerObject: 'b'}}
  ];
  testTable(
    {
      collection: nestedObjectRows,
      settings: {
        fields: [{key: 'outerObject.innerObject', label: 'Column'}]
      }
    },
    function () {
      test.length($('.reactive-table tbody tr'), 2, "table should have 2 rows");
      test.equal($('.reactive-table tbody tr:first-child td').text(), "a", "should display nested value");
      test.equal($('.reactive-table tbody tr:nth-child(2) td').text(), "b", "should display nested value");
    }
  );

  var nestedArrayRows = [
    {outerObject: ["a", "b", "c"]},
    {outerObject: ["d", "e", "f"]}
  ];
  testTable(
    {
      collection: nestedArrayRows,
      fields: [{key: 'outerObject.2', label: 'Column'}]
    },
    function () {
      test.length($('.reactive-table tbody tr'), 2, "table should have 2 rows");
      test.equal($('.reactive-table tbody tr:first-child td').text(), "c", "should display nested value");
      test.equal($('.reactive-table tbody tr:nth-child(2) td').text(), "f", "should display nested value");
    }
  );
});

Tinytest.add('Fields - hidden', function (test) {
  testTable(
    {
      collection: rows,
      settings: {
        fields: [
          {key: 'name', label: 'Visible', hidden: false},
          {key: 'score', label: 'Hidden', hidden: true}
        ]
      }
    },
    function () {
      test.length($('.reactive-table th'), 1, "one column should be visible");
      test.length($('.reactive-table th').text().trim().match(/Visible/), 1, "this column should be visible");
      test.isNull($('.reactive-table th').text().trim().match(/Hidden/), "this column should be hidden");
    }
  );

  testTable(
    {
      collection: rows,
      fields: [
        {key: 'name', label: 'Visible', hidden: function () { return false; }},
        {key: 'score', label: 'Hidden', hidden: function () { return true; }}
      ]
    },
    function () {
      test.length($('.reactive-table th'), 1, "one column should be visible");
      test.length($('.reactive-table th').text().trim().match(/Visible/), 1, "this column should be visible");
      test.isNull($('.reactive-table th').text().trim().match(/Hidden/), "this column should be hidden");
    }
  );
});

Tinytest.add('Fields - field named fields', function (test) {
  var rowsWithFields = _.map(rows, function (row) {
    return _.extend({fields: 'abcd'}, row);
  });
  testTable(
    { collection: rowsWithFields },
    function () {
      test.length($('.reactive-table th'), 3, "three columns should be rendered");
      test.length($('.reactive-table tbody tr td:first-child'), 6, "six rows should be rendered and have cells");
    }
  );
  testTable(
    {
      collection: rowsWithFields,
      fields: [
        { key: 'name', label: 'name' },
        { key: 'score', label: 'score' }
      ]
    },
    function () {
      test.length($('.reactive-table th'), 2, "two columns should be rendered");
      test.length($('.reactive-table tbody tr td:first-child'), 6, "six rows should be rendered and have cells");
    }
  );
});

testAsyncMulti('Fields - isVisible var updates table', [function (test, expect) {
  var nameVisible = new ReactiveVar(true);

  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {
      collection: rows,
      settings: {
        fields: [
          {fieldId: 'one', key: 'name', label: 'Name', isVisible: nameVisible},
          {fieldId: 'two', key: 'score', label: 'Score'}
        ]
      }
    },
    document.body
  );

  var expectNameVisibleAgain = expect(function () {
    test.length($('.reactive-table th'), 2, "two columns should be rendered");

    Blaze.remove(table);
  });

  var expectNameHidden = expect(function () {
    test.length($('.reactive-table th'), 1, "one column should be rendered");

    nameVisible.set(true);
    Meteor.setTimeout(expectNameVisibleAgain, 0);
  });

  var expectNameVisible = expect(function () {
    test.length($('.reactive-table th'), 2, "two columns should be rendered");

    nameVisible.set(false);
    Meteor.setTimeout(expectNameHidden, 0);
  });

  Meteor.setTimeout(expectNameVisible, 0);
}]);

testAsyncMulti('Fields - isVisible var updates from table change', [function (test, expect) {
  var nameVisible = new ReactiveVar(true);

  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {
      collection: rows,
      settings: {
        fields: [
          {fieldId: 'one', key: 'name', label: 'Name', isVisible: nameVisible},
          {fieldId: 'two', key: 'score', label: 'Score'}
        ],
        showColumnToggles: true
      }
    },
    document.body
  );

  var expectNameVisibleAgain = expect(function () {
    test.equal(nameVisible.get(), true, "name should be visible");

    Blaze.remove(table);
  });

  var expectNameHidden = expect(function () {
    test.equal(nameVisible.get(), false, "name should not be visible");

    $('.reactive-table-columns-dropdown input[data-fieldid="one"]').click();
    Meteor.setTimeout(expectNameVisibleAgain, 0);
  });

  var expectNameVisible = expect(function () {
    test.equal(nameVisible.get(), true, "name should be visible");

    $('.reactive-table-columns-dropdown input[data-fieldid="one"]').click();
    Meteor.setTimeout(expectNameHidden, 0);
  });

  Meteor.setTimeout(expectNameVisible, 0);
}]);