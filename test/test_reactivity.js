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

testAsyncMulti('Reactivity - collection changed by helper', [function (test, expect) {
  var collection = new Meteor.Collection();
  collection.insert({name: 'item 1', value: 1});
  var showCollection = new ReactiveVar(false);

  Template.testReactivity.helpers({
    collection: function () {
      if (showCollection.get()) {
        return collection;
      } else {
        return [];
      }
    }
  });

  var view = Blaze.renderWithData(
    Template.testReactivity,
    {},
    document.body
  );

  test.length($('.reactive-table tbody tr'), 0, 'table should be empty');

  showCollection.set(true);
  Meteor.setTimeout(expect(function () {
    test.length($('.reactive-table tbody tr'), 1, 'table should render collection');
    Blaze.remove(view);
  }), 0);
}]);

testAsyncMulti('Reactivity - setting changed by helper', [function (test, expect) {
  var useFontAwesome = new ReactiveVar(false);
  Template.testReactivity.helpers({
    collection: function () {
      return collection;
    },
    settings: function () {
      if (useFontAwesome.get()) {
        return {useFontAwesome: true}
      } else {
        return {useFontAwesome: false};
      }
    }
  });

  var view = Blaze.renderWithData(
    Template.testReactivity,
    {},
    document.body
  );

  test.length($('.reactive-table-filter .fa'), 0, "font awesome should be off");

  useFontAwesome.set(true);
  Meteor.setTimeout(expect(function () {
    test.length($('.reactive-table-filter .fa'), 1, "font awesome should be on");
    Blaze.remove(view);
  }), 0);
}]);