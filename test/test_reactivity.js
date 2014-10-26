testAsyncMulti('Reactivity - collection', [function (test, expect) {
  var collection = new Meteor.Collection();
  collection.insert({name: 'item 1', value: 1});
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: collection},
    document.body
  );
  test.length($('.reactive-table tbody tr'), 1, "table should initially have one row");
  collection.insert({name: 'item 2', value: 2});
  test.length($('.reactive-table tbody tr'), 2, "table should reactively add second row");
  collection.remove({name: 'item 2'});
  test.length($('.reactive-table tbody tr'), 1, "table should reactively remove a row");

  test.equal($('.reactive-table tbody tr:first-child td:nth-child(2)').text(), "1", "table row should have the initial value");
  collection.update({name: 'item 1'}, {'$set': {value: 2}});
  Meteor.setTimeout(expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:nth-child(2)').text(), "2", "table should reactively update with new value");
    Blaze.remove(table);
  }), 0);
}]);
