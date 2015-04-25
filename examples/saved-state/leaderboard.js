// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

if (Meteor.isClient) {
  Template.leaderboard.onCreated(function () {
    var currentPage = new ReactiveVar(Session.get('current-page') || 0);
    this.currentPage = currentPage;
    this.autorun(function () {
      Session.set('current-page', currentPage.get());
    });
  });

  Template.leaderboard.helpers({
    players : function () {
      return Players.find({}, {sort: {score: -1, name: 1}});
    },

    tableSettings : function () {
      return {
          currentPage: Template.instance().currentPage,
          fields: [
            { key: 'name', label: 'Full Name' },
            { key: 'name', label: 'First Name', fn: function (name) { return name ? name.split(' ')[0] : ''; } },
            { key: 'score', label: 'Score' }
          ]
      };
    },

    selected_name : function () {
      var player = Players.findOne(Session.get("selected_player"));
      return player && player.name;
    }
  });

  Template.player.helpers({
    selected : function () {
      return Session.equals("selected_player", this._id) ? "selected" : '';
    }
  });

  Template.leaderboard.events({
    'click input.inc': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }
  });
}
