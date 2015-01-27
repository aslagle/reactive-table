ReactiveTable = {};

ReactiveTable.publish = function (name, collection, selector, settings) {
  if (collection) {
    Meteor.publish("reactive-table-" + name, function (publicationId, filter, fields, options, rowsPerPage) {
      if (_.isFunction(collection)) {
        collection = collection.call(this);
      }

      if (!(collection instanceof Meteor.Collection)) {
        console.log("ReactiveTable.publish: no collection to publish");
        return [];
      }

      if (_.isFunction(selector)) {
        selector = selector.call(this);
      }
      var self = this;
      var filterQuery = _.extend(getFilterQuery(filter, fields, settings), selector);
      var cursor = collection.find(filterQuery, options);
      var count = cursor.count();

      var getRow = function (row, index) {
        return _.extend({
          "reactive-table-id": publicationId,
          "reactive-table-sort": index
        }, row);
      };

      var getId = function (rowId) {
        return publicationId + "-" + rowId;
      };

      var getRows = function () {
        return _.map(cursor.fetch(), getRow);
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
              self.changed("reactive-table-rows", getId(row._id), row);
              rows[row._id] = row;
            }
          } else {
            self.added("reactive-table-rows", getId(row._id), row);
            rows[row._id] = row;
          }
        });
      };

      self.added("reactive-table-counts", publicationId, {count: count});
      _.each(rows, function (row) {
        self.added("reactive-table-rows", getId(row._id), row);
      });

      var initializing = true;

      var handle = cursor.observeChanges({
        added: function (id, fields) {
          if (!initializing) {
            self.changed("reactive-table-counts", publicationId, {count: cursor.count()});
            updateRows();
          }
        },

        removed: function (id, fields) {
          self.changed("reactive-table-counts", publicationId, {count: cursor.count()});
          self.removed("reactive-table-rows", getId(id));
          delete rows[id];
          updateRows();
        },

        changed: function (id, fields) {
          updateRows();
        }

      });
      initializing = false;

      self.ready();

      self.onStop(function () {
        handle.stop();
      });
    });
  } else {
    return [];
  }
};
