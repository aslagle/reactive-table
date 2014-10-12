testAsyncMulti('Events - click event', [function (test, expect) {
  var expectClicked = expect(function () {
    Blaze.remove(table);
  });

  var clickHandler = function () {
    test.equal(this.name, "Ada Lovelace", "this should be the row object");
    test.equal(this.score, 5, "this should be the row object");
    expectClicked();
  };

  Template.testEventsTmpl.events({
    "click .reactive-table tbody tr": clickHandler
  });

  var table = Blaze.renderWithData(
    Template.testEventsTmpl,
    {collection: rows},
    document.body
  );

  $('.reactive-table tbody tr:first-child').click();
}]);
