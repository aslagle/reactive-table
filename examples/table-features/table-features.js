var Tables = new Meteor.Collection('features');

if (Meteor.isClient) {
  Template.featureComparison.tables = function () {
    return Tables;
  };

  var checkOrX = function (value) {
    var html;
    // first, normalize the value to a canonical interpretation
    if (typeof value === 'boolean')
      value = {
        support: value
      };

    if (value === null || value === undefined) {
      html = '<span style="color: orange; font-weight: bold">?</span>';
    } else {
      if (value.support === true)
        html = '<span style="color: green">&#10004;</span>'
      else if (value.support === false)
        html = '<span style="color: red">&#10008;</span>';
      else
        html = '<span style="color: lightblue">' + value.support + '</span>';
      if (value.link)
        html += ' (<a href="' + value.link + '">more</a>)';
      }
    return new Spacebars.SafeString(html);
  };

  Template.featureComparison.tableSettings = function () {
    return {
      rowsPerPage: 5,
      showNavigation: 'auto',
      showColumnToggles: true,
      fields: [
        {
          key: 'name',
          label: 'Library',
          fn: function (name, object) {
            var html = '<a name="' + name +'" target="_blank" href="' + object.url + '">' + name + '</a>';
            return new Spacebars.SafeString(html);
          }
        },
        { key: 'sort', label: 'Sorting', fn: checkOrX },
        { key: 'pages', label: 'Pagination', fn: checkOrX },
        { key: 'filter', label: 'Filtering/Search', fn: checkOrX },
        { key: 'resize', label: 'Resizable Columns', fn: checkOrX },
        { key: 'edit', label: 'Inline Editing', fn: checkOrX },
        { key: 'responsive', label: 'Mobile/Responsive', fn: checkOrX, hidden: true },
        { key: 'i18n', label: 'Internationalization', fn: checkOrX, hidden: true },
        { key: 'keyboard', label: 'Keyboard navigation', fn: checkOrX, hidden: true },
        { key: 'meteor', label: 'Meteor Integration', fn: checkOrX, hidden: function () { return true; } }
      ]
    };
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Tables.remove({'name': {'$exists': true}});

    Tables.insert({
      'name': 'reactive-table',
      'url': 'https://github.com/ecohealthalliance/reactive-table',
      'sort': true,
      'pages': true,
      'filter': true,
      'resize': false,
      'edit': false,
      'responsive': false,
      'i18n': true,
      'keyboard': false,
      'meteor': true
    });

    Tables.insert({
      'name': 'DataTables',
      'url': 'https://datatables.net/',
      'sort': true,
      'pages': true,
      'filter': true,
      'resize': true,
      'edit': true,
      'responsive': {support: true, link: 'https://datatables.net/release-datatables/examples/basic_init/flexible_width.html'},
      'i18n': true,
      'keyboard': {support: true, link: 'http://datatables.net/release-datatables/extras/KeyTable/'},
      'meteor': {support: 'partial', 'link': 'https://github.com/ecohealthalliance/reactive-table/issues/10#issuecomment-35941155'}
    });

    Tables.insert({
      'name': 'SlickGrid',
      'url': 'https://github.com/mleibman/SlickGrid',
      'sort': true,
      'filter': true,
      'resize': true,
      'edit': true,
      'meteor': {support: 'partial', link: 'https://github.com/ecohealthalliance/reactive-table/issues/10#issuecomment-35941155'}
    });

    Tables.insert({
      'name': 'Dynatable',
      'url': 'http://www.dynatable.com/',
      'sort': true,
      'pages': true,
      'filter': true,
      'resize': false,
      'edit': false,
      'responsive': true,
      'keyboard': false,
      'meteor': {support: false, 'link': 'https://github.com/alfajango/jquery-dynatable/issues/59'}
    });

    Tables.insert({
      'name': 'tablesorter',
      'url': 'https://github.com/Mottie/tablesorter',
      'sort': true,
      'pages': {support: true, link: 'http://mottie.github.io/tablesorter/docs/example-pager.html'},
      'filter': true,
      'edit': true
    });

    Tables.insert({
      'name': 'Handsontable',
      'url': 'http://handsontable.com/',
      'sort': true,
      'pages': true,
      'filter': {support: true, link: 'http://handsontable.com/demo/search.html'},
      'resize': {support: true, link: 'http://handsontable.com/demo/column_resize.html'},
      'edit': true,
      'keyboard': true,
      'meteor': {support: true, link: 'https://github.com/olragon/meteor-handsontable/'}
    });

    Tables.insert({
      'name': 'jqWidgets jqxGrid',
      'url': 'http://www.jqwidgets.com/jquery-widgets-demo/demos/jqxgrid/index.htm',
      'sort': {support: true, link: 'http://www.jqwidgets.com/jquery-widgets-demo/demos/jqxgrid/index.htm#demos/jqxgrid/customsorting.htm'},
      'pages': {support: true, link: 'http://www.jqwidgets.com/jquery-widgets-demo/demos/jqxgrid/index.htm#demos/jqxgrid/paging.htm'},
      'filter': {support: true, link: 'http://www.jqwidgets.com/jquery-widgets-demo/demos/jqxgrid/index.htm#demos/jqxgrid/filtering.htm'},
      'resize': {support: true, link: 'http://www.jqwidgets.com/jquery-widgets-demo/demos/jqxgrid/index.htm#demos/jqxgrid/columnsresizing.htm'},
      'edit': {support: true, link: 'http://www.jqwidgets.com/jquery-widgets-demo/demos/jqxgrid/index.htm#demos/jqxgrid/spreadsheet.htm'},
      'responsive': false,
      'i18n': {support: true, link: 'http://www.jqwidgets.com/jquery-widgets-demo/demos/jqxgrid/index.htm#demos/jqxgrid/localization.htm'},
      'keyboard': {support: true, link: 'http://www.jqwidgets.com/jquery-widgets-demo/demos/jqxgrid/index.htm#demos/jqxgrid/keyboardsupport.htm'}
    });

  });
}
