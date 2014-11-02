Tinytest.add('Template - nested', function (test) {
  var view = Blaze.renderWithData(
    Template.testTmpl,
    {collection: rows, array: [1]},
    document.body
  );
  test.length($('.reactive-table th'), 2, "two columns should be rendered");
  test.length($('.reactive-table tbody tr td:first-child'), 6, "six rows should be rendered and have cells");
  Blaze.remove(view);

  var view2 = Blaze.renderWithData(
    Template.testTmpl,
    {collection: rows, array: [{fields: 'abc'}]},
    document.body
  );
  test.length($('.reactive-table th'), 2, "two columns should be rendered");
  test.length($('.reactive-table tbody tr td:first-child'), 6, "six rows should be rendered and have cells");
  Blaze.remove(view2);
});
