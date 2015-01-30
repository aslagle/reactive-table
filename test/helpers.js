testTable = function(tableData, testFunction) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    tableData,
    document.body
  );
  testFunction();
  Blaze.remove(table);
};

rows = [
  {name: 'Ada Lovelace', score: 5},
  {name: 'Grace Hopper', score: 10},
  {name: 'Marie Curie', score: 5},
  {name: 'Carl Friedrich Gauss', score: 0},
  {name: 'Nikola Tesla', score: 15},
  {name: 'Claude Shannon', score: 5}
];

if (Meteor.isClient) {
  collection = new Mongo.Collection();
  _.each(rows, function (row) {
    collection.insert(row);
  });
}

if (Meteor.isServer) {
  collection = new Mongo.Collection('players');
  collection.remove({});
  _.each(rows, function (row) {
    collection.insert(row);
  });

  ReactiveTable.publish('collection', collection);

  ReactiveTable.publish('collection-and-selector', collection, {score: 5});

  ReactiveTable.publish('collection-function', function () {
    return collection;
  });

  ReactiveTable.publish('selector-function', collection, function () {
    return {score: 5};
  });
}
