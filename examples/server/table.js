var Rows = new Meteor.Collection('rows');

if (Meteor.isClient) {

  Template.table.helpers({
    fields: function () {
      return ['string', 'number'];
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Rows.find().count() === 0) {
      for (var i = 0; i < 20000; i++) {
          var randomString = Math.random().toString(36).substr(7);
          var randomNumber = Math.floor(Math.random() * 100);
          Rows.insert({string: randomString, number: randomNumber});
        }
      }
  });

  ReactiveTable.publish('rows', function () { return Rows; }, {});
}
