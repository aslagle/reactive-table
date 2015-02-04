// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

if (Meteor.isClient) {
  Template.leaderboard.helpers({
    players : function () {
      return Players.find({}, {sort: {score: -1, name: 1}});
    },

    tableSettings : function () {
      return {
          fields: [
            { key: 'name', label: 'Full Name' },
            { key: 'name', label: 'First Name', fn: function (name) { return name ? name.split(' ')[0] : ''; } },
            { key: 'score', label: 'Score' },
            { key: 'date', label: 'Date', sortByValue: true, fn: function (date) { return moment(date).format("dddd, MMMM Do YYYY"); }},
            { 
                key: 'checked', 
                label: 'Checked', 
                fn: function (checked) { 
                  var html = '<span style="color: green">&#10004;</span>'
                  if (checked === false) {
                   html = '<span style="color: red">&#10008;</span>';
                  }
                  return new Spacebars.SafeString(html);
                }
            }
          ],
          filters: [
            'filter1', 
            'filter2', 
            'filter3',
            'date-filter', 
            'checkbox-filter', 
            'greater-than-filter', 
            'compound-check-filter', 
            'compound-score-filter', 
            'quote-filter',
            'autocomplete-filter',
            'select-filter'
          ]
      };
    },

    nameFields: function () {
      return ['name'];
    },

    scoreFields: function () {
      return ['score'];
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
      var dates = [
          "2014-12-10", 
          "2011-12-09",
          "2016-11-07",
          "2012-04-30",
          "2014-07-10",
          "2016-04-30"
      ];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5, date: dates[i], checked: (Random.fraction()>0.5)});
    }
  });

  ReactiveTable.publish('players', Players);
}
