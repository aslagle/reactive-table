var collection = new Mongo.Collection('reactivity-test');
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

var collection2 = new Mongo.Collection('reactivity-test-access');
collection2.remove({});
collection2.insert({name: 'item 1', value: 1});

if (!Meteor.users.findOne()) {
  Accounts.createUser({username: 'abcd', password: 'abcd1234'});
}


ReactiveTable.publish('reactivity-test-access', function () {
  if (this.userId) {
    return collection2;
  } else {
    return [];
  }
});
