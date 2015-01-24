Tinytest.add('Collection Argument - array named argument', function (test) {
  testTable(
    {collection: rows},
    function () {
      test.length($('.reactive-table tbody tr'), 6, "rendered table should have 6 rows");
    }
  );
});

Tinytest.add('Collection Argument - collection named argument', function (test) {
  testTable(
    {collection: collection},
    function () {
      test.length($('.reactive-table tbody tr'), 6, "rendered table should have 6 rows");
    }
  );
});

Tinytest.add('Collection Argument - cursor named argument', function (test) {
  testTable(
    {collection: collection.find({score: 5})},
    function () {
      test.length($('.reactive-table tbody tr'), 3, "rendered table should have 3 rows");
    }
  );
});

Tinytest.add('Collection Argument - collection as only argument', function (test) {
  testTable(
    collection,
    function () {
      test.length($('.reactive-table tbody tr'), 6, "rendered table should have 6 rows");
    }
  );
});

Tinytest.add('Collection Argument - in settings argument', function (test) {
  testTable(
    {settings: {collection: rows}},
    function () {
      test.length($('.reactive-table tbody tr'), 6, "rendered table should have 6 rows");
    }
  );
});

testAsyncMulti('Collection Argument - server-side collection', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: 'collection', fields: ['name', 'score']},
    document.body
  );

  var expectSixRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 6, "rendered table should have 6 rows");
    Blaze.remove(table);
  });

  Meteor.setTimeout(expectSixRows, 500);
}]);

testAsyncMulti('Collection Argument - server-side collection with selector', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: 'collection-and-selector', fields: ['name', 'score']},
    document.body
  );

  var expectThreeRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 3, "rendered table should have 3 rows");
    Blaze.remove(table);
  });

  Meteor.setTimeout(expectThreeRows, 500);
}]);

testAsyncMulti('Collection Argument - server-side collection function', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: 'collection-function', fields: ['name', 'score']},
    document.body
  );

  var expectSixRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 6, "rendered table should have 6 rows");
    Blaze.remove(table);
  });

  Meteor.setTimeout(expectSixRows, 500);
}]);

testAsyncMulti('Collection Argument - server-side collection with selector function', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: 'selector-function', fields: ['name', 'score']},
    document.body
  );

  var expectThreeRows = expect(function () {
    test.length($('.reactive-table tbody tr'), 3, "rendered table should have 3 rows");
    Blaze.remove(table);
  });

  Meteor.setTimeout(expectThreeRows, 500);
}]);
