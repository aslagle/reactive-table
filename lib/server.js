ReactiveTable = {};

ReactiveTable.publish = function (name, collectionOrFunction, selectorOrFunction, settings) {
    Meteor.publish("reactive-table-" + name, function (publicationId, filters, fields, options, rowsPerPage, serverArgs) {
      check(publicationId, String);
      check(filters, [Match.OneOf(String, Object, Mongo.ObjectID)]);
      check(fields, [[String]]);
      check(options, {skip: Match.Integer, limit: Match.Integer, sort: Object});
      check(rowsPerPage, Match.Integer);
      check(serverArgs, Match.Optional(Match.Any));

      var collection;
      var selector;

      if (_.isFunction(collectionOrFunction)) {
        collection = collectionOrFunction.call(this, serverArgs);
      } else {
        collection = collectionOrFunction;
      }

      if (!(collection instanceof Mongo.Collection)) {
        console.log("ReactiveTable.publish: no collection to publish");
        return [];
      }

      if (_.isFunction(selectorOrFunction)) {
        selector = selectorOrFunction.call(this, serverArgs);
      } else {
        selector = selectorOrFunction;
      }
      var self = this;
      var filterQuery = _.extend(getFilterQuery(filters, fields, settings), selector);
      if (settings && settings.fields) {
        options.fields = settings.fields;
      }
      var pageCursor = collection.find(filterQuery, options);
      var fullCursor = collection.find(filterQuery);
      var count = fullCursor.count();

      var getRow = function (row, index) {
        return _.extend({
          "reactive-table-id": publicationId,
          "reactive-table-sort": index
        }, row);
      };

      var getRows = function () {
        return _.map(pageCursor.fetch(), getRow);
      };
      var rows = {};
      _.each(getRows(), function (row) {
        rows[row._id] = row;
      });

      var updateRows = function () {
        var newRows = getRows();
        _.each(newRows, function (row, index) {
          var oldRow = rows[row._id];
          if (oldRow) {
            if (!_.isEqual(oldRow, row)) {
              self.changed("reactive-table-rows-" + publicationId, row._id, row);
              rows[row._id] = row;
            }
          } else {
            self.added("reactive-table-rows-" + publicationId, row._id, row);
            rows[row._id] = row;
          }
        });
      };

      self.added("reactive-table-counts", publicationId, {count: count});
      _.each(rows, function (row) {
        self.added("reactive-table-rows-" + publicationId, row._id, row);
      });

      if (!(settings || {}).disableRowReactivity) {
        var initializing = true;

        var handle = pageCursor.observeChanges({
          added: function (id, fields) {
            if (!initializing) {
              updateRows();
            }
          },

          removed: function (id, fields) {
            self.removed("reactive-table-rows-" + publicationId, id);
            delete rows[id];
            updateRows();
          },

          changed: function (id, fields) {
            updateRows();
          }

        });
      }

      if (!(settings || {}).disablePageCountReactivity) {
        var countHandle = fullCursor.observeChanges({
          added: function (id, fields) {
            if (!initializing) {
              self.changed("reactive-table-counts", publicationId, {count: fullCursor.count()});
            }
          },

          removed: function (id, fields) {
            self.changed("reactive-table-counts", publicationId, {count: fullCursor.count()});
          }
        });
      }
      initializing = false;

      self.ready();

      self.onStop(function () {
        if (handle) handle.stop();
        if (countHandle) countHandle.stop();
      });
    });
};
