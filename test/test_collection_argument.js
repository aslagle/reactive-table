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
