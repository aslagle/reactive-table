testAsyncMulti('Compatibility - collection with dburles:collection-helpers', [function (test, expect) {
  var collectionWithHelpers = new Mongo.Collection();
  _.each(rows, function (row) {
    collectionWithHelpers.insert(row);
  });
  collectionWithHelpers.helpers({
    "first": function () {
      return this.name.slice(0, 1);
    }
  });

  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {
      collection: collectionWithHelpers,
      fields: [
        {key: "first", label: "first", fn: function (val, obj) { return obj.first(); } }
      ]
    },
    document.body
  );
  test.length($('.reactive-table tbody tr'), 6, "rendered table should have 6 rows");
  test.equal($('.reactive-table tbody tr:first-child td').text(), "A", "table should display output of helper");

  collectionWithHelpers.update({name: 'Ada Lovelace'}, {'$set': {name: 'Bbbbb'}});
  Meteor.setTimeout(expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td').text(), "B", "table should display output of helper");
    Blaze.remove(table);
  }), 0);
}]);

testAsyncMulti('Compatibility - cursor with dburles:collection-helpers', [function (test, expect) {
  var collectionWithHelpers = new Mongo.Collection();
  _.each(rows, function (row) {
    collectionWithHelpers.insert(row);
  });
  collectionWithHelpers.helpers({
    "first": function () {
      return this.name.slice(0, 1);
    }
  });

  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {
      collection: collectionWithHelpers.find(),
      fields: [
        {key: "first", label: "first", fn: function (val, obj) { return obj.first(); } }
      ]
    },
    document.body
  );
  test.length($('.reactive-table tbody tr'), 6, "rendered table should have 6 rows");
  test.equal($('.reactive-table tbody tr:first-child td').text(), "A", "table should display output of helper");

  collectionWithHelpers.update({name: 'Ada Lovelace'}, {'$set': {name: 'Bbbbb'}});
  Meteor.setTimeout(expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td').text(), "B", "table should display output of helper");
    Blaze.remove(table);
  }), 0);
}]);
