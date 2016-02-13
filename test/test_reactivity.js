testAsyncMulti('Reactivity - collection', [function (test, expect) {
  var collection = new Mongo.Collection();
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

testAsyncMulti('Reactivity - cursor', [function (test, expect) {
  var collection = new Meteor.Collection();
  collection.insert({name: 'item 1', value: 1});
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: collection.find()},
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
  var collection = new Mongo.Collection();
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

testAsyncMulti('Reactivity - user-editable setting persists', [function (test, expect) {
  var rowsPerPage = new ReactiveVar(2);
  Template.testReactivity.helpers({
    collection: function () {
      return collection;
    },
    settings: function () {
      return {rowsPerPage: rowsPerPage.get()};
    }
  });

  var view = Blaze.renderWithData(
    Template.testReactivity,
    {},
    document.body
  );

  test.length($('.reactive-table tbody tr'), 2, "two rows should be rendered");

  var expectSameRowsPerPage = expect(function () {
    test.length($('.reactive-table tbody tr'), 2, "two rows should be rendered");
    Blaze.remove(view);
  });

  rowsPerPage.set(5);
  Meteor.setTimeout(expectSameRowsPerPage, 0);
}]);

testAsyncMulti('Reactivity - user setting persists when other arguments change', [function (test, expect) {
  var showCollection = new ReactiveVar(true);
  Template.testReactivity.helpers({
    collection: function () {
      if (showCollection.get()) {
        return collection;
      } else {
        return rows;
      }
    },
    settings: function () {
      return {rowsPerPage: 2};
    }
  });

  var view = Blaze.renderWithData(
    Template.testReactivity,
    {},
    document.body
  );

  test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Ada Lovelace", "should be on first page");
  test.length($('.reactive-table tbody tr'), 2, "first page should have two rows");
  test.equal($('.reactive-table-navigation .page-number input').val(), "1", "displayed page number should be 1");

  var testSecondPage = function () {
    test.equal($('.reactive-table tbody tr:first-child td:first-child').text(), "Claude Shannon", "should be on the second page");
    test.equal($('.reactive-table-navigation .page-number input').val(), "2", "displayed page number should be 2");
  };

  var expectStillSecondPage = expect(function () {
      testSecondPage();
      Blaze.remove(view);
    });

  var expectSecondPage = expect(function () {
    testSecondPage();

    showCollection.set(false);
    Meteor.setTimeout(expectStillSecondPage, 0);
  });

  $('.reactive-table-navigation .page-number input').val('2');
  $('.reactive-table-navigation .page-number input').trigger("change");

  Meteor.setTimeout(expectSecondPage, 0);


  showCollection.set(true);
}]);

testAsyncMulti('Reactivity - adding new visible field with fieldIds', [function (test, expect) {
  var add2ndField = new ReactiveVar(false);
  Template.testReactivity.helpers({
    collection: function () {
      return collection;
    },
    settings: function () {
      if (add2ndField.get()) {
        return {
          fields: [
            {fieldId: 'one', key: 'name', label: 'name', hidden: false},
            {fieldId: 'two', key: 'score', label: 'score', hidden: false}
          ]
        }
      } else {
        return {
          fields: [
            {fieldId: 'one', key: 'name', label: 'name', hidden: false}
          ]
        }
      }
    }
  });

  var view = Blaze.renderWithData(
    Template.testReactivity,
    {},
    document.body
  );

  test.length($('.reactive-table th'), 1, "one column should be rendered");
  test.length($('.reactive-table th:first-child').text().trim().match(/^name/), 1, "first column should be name");

  add2ndField.set(true);
  Meteor.setTimeout(expect(function () {
    test.length($('.reactive-table th'), 2, "two columns should be rendered");
    test.length($('.reactive-table th:first-child').text().trim().match(/^name/), 1, "first column should be name");
    test.length($('.reactive-table th:nth-child(2)').text().trim().match(/^score/), 1, "second column should be score");
    Blaze.remove(view);
  }), 0);
}]);

testAsyncMulti('Reactivity - adding new hidden field with fieldIds', [function (test, expect) {
  var add2ndField = new ReactiveVar(false);
  Template.testReactivity.helpers({
    collection: function () {
      return collection;
    },
    settings: function () {
      if (add2ndField.get()) {
        return {
          fields: [
            {fieldId: 'one', key: 'name', label: 'name', hidden: false},
            {fieldId: 'two', key: 'score', label: 'score', hidden: true}
          ]
        }
      } else {
        return {
          fields: [
            {fieldId: 'one', key: 'name', label: 'name', hidden: false}
          ]
        }
      }
    }
  });

  var view = Blaze.renderWithData(
    Template.testReactivity,
    {},
    document.body
  );

  test.length($('.reactive-table th'), 1, "one column should be rendered");
  test.length($('.reactive-table th:first-child').text().trim().match(/^name/), 1, "first column should be name");

  add2ndField.set(true);
  Meteor.setTimeout(expect(function () {
    test.length($('.reactive-table th'), 1, "one column should be rendered");
    test.length($('.reactive-table th:first-child').text().trim().match(/^name/), 1, "first column should be name");
    test.isNull($('.reactive-table th:nth-child(2)').text().trim().match(/^score/), 1, "second column should be hidden");
    Blaze.remove(view);
  }), 0);
}]);

testAsyncMulti('Reactivity - adding new visible field without fieldIds', [function (test, expect) {
  var add2ndField = new ReactiveVar(false);
  Template.testReactivity.helpers({
    collection: function () {
      return collection;
    },
    settings: function () {
      if (add2ndField.get()) {
        return {
          fields: [
            {key: 'score', label: 'score', hidden: false},
            {key: 'name', label: 'name', hidden: false}
          ]
        }
      } else {
        return {
          fields: [
            {key: 'name', label: 'name', hidden: false}
          ]
        }
      }
    }
  });

  var view = Blaze.renderWithData(
    Template.testReactivity,
    {},
    document.body
  );

  test.length($('.reactive-table th'), 1, "one column should be rendered");
  test.length($('.reactive-table th:first-child').text().trim().match(/^name/), 1, "first column should be name");

  add2ndField.set(true);
  Meteor.setTimeout(expect(function () {
    test.length($('.reactive-table th'), 2, "two columns should be rendered");
    test.length($('.reactive-table th:first-child').text().trim().match(/^score/), 1, "first column should be score");
    test.length($('.reactive-table th:nth-child(2)').text().trim().match(/^name/), 1, "second column should be name");
    Blaze.remove(view);
  }), 0);
}]);

testAsyncMulti('Reactivity - server-side collection', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: 'reactivity-test', fields: ['name', 'value']},
    document.body
  );

  var expectUpdate = expect(function () {
    test.equal($('.reactive-table tbody tr:first-child td:nth-child(2)').text(), "2", "table should reactively update with new value");
    Blaze.remove(table);
  });

  var expectRemove = expect(function () {
    test.length($('.reactive-table tbody tr'), 1, "table should reactively remove a row");

    test.equal($('.reactive-table tbody tr:first-child td:nth-child(2)').text(), "1", "table row should have the initial value");
    Meteor.call('testUpdate', function () {
      Meteor.setTimeout(expectUpdate, 500);
    });
  });

  var expectInsert = expect(function () {
    test.length($('.reactive-table tbody tr'), 2, "table should reactively add second row");
    Meteor.call('testRemove', function () {
      Meteor.setTimeout(expectRemove, 500);
    });
  });

  var expectInitialRow = expect(function () {
    test.length($('.reactive-table tbody tr'), 1, "table should initially have one row");
    Meteor.call('testInsert', function () {
      Meteor.setTimeout(expectInsert, 500);
    });
  });

  Meteor.setTimeout(expectInitialRow, 500);
}]);

testAsyncMulti('Reactivity - server-side collection access', [function (test, expect) {
  var table = Blaze.renderWithData(
    Template.reactiveTable,
    {collection: 'reactivity-test-access', fields: ['name', 'value']},
    document.body
  );

  var expectDataHidden = expect(function () {
    test.length($('.reactive-table tbody tr'), 0, "table should remove row");
    Blaze.remove(table);
  });

  var expectData = expect(function () {
    test.length($('.reactive-table tbody tr'), 1, "table should show one row");
    Meteor.logout(function () {
      Meteor.setTimeout(expectDataHidden, 500);
    });
  });

  var expectNoData = expect(function () {
    test.length($('.reactive-table tbody tr'), 0, "table should initially have no rows");
    Meteor.loginWithPassword('abcd', 'abcd1234', function () {
      Meteor.setTimeout(expectData, 500);
    });
  });

  Meteor.logout(function () {
    Meteor.setTimeout(expectNoData, 500);
  });
}]);

