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

Tinytest.add('Fields - labels', function (test) {
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

Tinytest.add('Fields - default sort', function (test) {
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
          {key: 'name', label: 'Hidden', hidden: true}
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
        {key: 'name', label: 'Hidden', hidden: function () { return true; }}
      ]
    },
    function () {
      test.length($('.reactive-table th'), 1, "one column should be visible");
      test.length($('.reactive-table th').text().trim().match(/Visible/), 1, "this column should be visible");
      test.isNull($('.reactive-table th').text().trim().match(/Hidden/), "this column should be hidden");
    }
  );
});
