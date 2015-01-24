var collection = new Meteor.Collection('reactivity-test');
collection.remove({});
collection.insert({name: 'item 1', value: 1});

ReactiveTable.publish('reactivity-test', collection);

Meteor.methods({
  "testInsert": function () {
    collection.insert({name: 'item 2', value: 2});
  },

  "testRemove": function () {
    collection.remove({name: 'item 2'});
  },

  "testUpdate": function () {
    collection.update({name: 'item 1'}, {'$set': {value: 2}});
  }
});
