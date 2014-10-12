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

collection = new Meteor.Collection();
_.each(rows, function (row) {
  collection.insert(row);
});
