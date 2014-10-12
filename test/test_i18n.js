Tinytest.add('i18n - default english', function (test) {
  testTable(
    rows,
    function () {
      test.equal($('.reactive-table-filter span').text().trim(), "Filter", "filter text");
      test.length($('.reactive-table-navigation .rows-per-page').text().trim().match(/^Show.*rows\sper\spage$/), 1, "rows per page text");
    }
  );
});

Tinytest.add('i18n - french', function (test) {
  i18n.setLanguage('fr');
  testTable(
    rows,
    function () {
      test.equal($('.reactive-table-filter span').text().trim(), "Filtre", "filter text");
      test.length($('.reactive-table-navigation .rows-per-page').text().trim().match(/^Voir.*lignes\spar\spage$/), 1, "rows per page text");
    }
  );
  i18n.setLanguage('en');
});
