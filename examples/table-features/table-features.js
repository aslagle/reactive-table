var Tables = new Meteor.Collection('features');

if (Meteor.isClient) {

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

  Template.featureComparison.helpers({
    tables : function () {
      return Tables;
    },

    tableSettings : function () {
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
          { key: 'multisort', label: 'Multi-column sorting', fn: checkOrX },
          { key: 'pages', label: 'Pagination', fn: checkOrX },
          { key: 'filter', label: 'Filtering/Search', fn: checkOrX },
          { key: 'resize', label: 'Resizable Columns', fn: checkOrX },
          { key: 'edit', label: 'Inline Editing', fn: checkOrX },
          { key: 'responsive', label: 'Mobile/Responsive', fn: checkOrX },
          { key: 'i18n', label: 'Internationalization', fn: checkOrX, hidden: true },
          { key: 'keyboard', label: 'Keyboard navigation', fn: checkOrX, hidden: true },
          { key: 'plugins', label: 'Plugins', fn: checkOrX, hidden: true },
          { key: 'meteor', label: 'Meteor Integration', fn: checkOrX, hidden: true },
          { key: 'lastUpdate', label: 'Last update', fn: checkOrX }
        ]
      };
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Tables.remove({'name': {'$exists': true}});

    Tables.insert({
      name: 'reactive-table',
      url: 'https://github.com/ecohealthalliance/reactive-table',
      multisort: false,
      pages: true,
      filter: true,
      resize: false,
      edit: false,
      responsive: false,
      i18n: true,
      keyboard: false,
      plugins: undefined,
      meteor: true
    });

    Tables.insert({
      name: 'DataTables',
      url: 'https://datatables.net/',
      multisort: {support: true, link: 'http://www.datatables.net/examples/basic_init/multi_col_sort.html'},
      pages: true,
      filter: true,
      resize: true,
      edit: true,
      responsive: {support: true, link: 'https://datatables.net/release-datatables/examples/basic_init/flexible_width.html'},
      i18n: true,
      keyboard: {support: true, link: 'http://datatables.net/release-datatables/extras/KeyTable/'},
      plugins: {support: 'plugins & extensions', link: 'https://datatables.net/plug-ins/'},
      meteor: {support: 'partial', 'link': 'https://github.com/ecohealthalliance/reactive-table/issues/10#issuecomment-35941155'},
      lastUpdate: {support: 'probably today', link: 'https://github.com/DataTables/DataTables'}
    });

    Tables.insert({
      name: 'SlickGrid',
      url: 'https://github.com/mleibman/SlickGrid',
      multisort: {support: true, link: 'http://mleibman.github.io/SlickGrid/examples/example-multi-column-sort.html'},
      filter: true,
      resize: true,
      edit: true,
      responsive: undefined,
      i18n: undefined,
      keyboard: undefined,
      plugins: {support: true, link: 'https://github.com/mleibman/SlickGrid/wiki/Examples'},
      meteor: {support: 'partial', link: 'https://github.com/ecohealthalliance/reactive-table/issues/10#issuecomment-35941155'},
      lastUpdate: {support: 'stalled', link: 'https://github.com/mleibman/SlickGrid'}
    });

    Tables.insert({
      name: 'Dynatable',
      url: 'http://www.dynatable.com/',
      multisort: {support: true, link: 'http://www.dynatable.com/#sorting'},
      pages: true,
      filter: true,
      resize: false,
      edit: false,
      responsive: true,
      i18n: undefined,
      keyboard: false,
      plugins: undefined,
      meteor: {support: false, 'link': 'https://github.com/alfajango/jquery-dynatable/issues/59'}
    });

    Tables.insert({
      name: 'tablesorter',
      url: 'https://github.com/Mottie/tablesorter',
      multisort: {support: true, link: 'https://github.com/Mottie/tablesorter#features'},
      pages: {support: true, link: 'http://mottie.github.io/tablesorter/docs/example-pager.html'},
      filter: true,
      edit: true,
      responsive: undefined,
      i18n: undefined,
      keyboard: undefined,
      plugins: undefined,
      meteor: undefined
    });

    Tables.insert({
      name: 'Handsontable',
      url: 'http://handsontable.com/',
      multisort: {support: false, link: 'https://github.com/handsontable/jquery-handsontable/wiki/Understanding-column-sorting-plugin'},
      pages: {support: true, link: 'http://handsontable.com/demo/pagination.html'},
      filter: {support: true, link: 'http://handsontable.com/demo/search.html'},
      resize: {support: true, link: 'http://handsontable.com/demo/column_resize.html'},
      edit: true,
      responsive: undefined,
      i18n: undefined,
      keyboard: true,
      plugins: undefined,
      meteor: {support: true, link: 'https://github.com/olragon/meteor-handsontable/'}
    });

    Tables.insert({
      name: 'jqWidgets jqxGrid',
      url: 'http://www.jqwidgets.com/jquery-widgets-demo/demos/jqxgrid/index.htm',
      multisort: {support: false, link: 'http://www.jqwidgets.com/community/topic/sorting-by-multiple-columns/'},
      pages: {support: true, link: 'http://www.jqwidgets.com/jquery-widgets-demo/demos/jqxgrid/index.htm#demos/jqxgrid/paging.htm'},
      filter: {support: true, link: 'http://www.jqwidgets.com/jquery-widgets-demo/demos/jqxgrid/index.htm#demos/jqxgrid/filtering.htm'},
      resize: {support: true, link: 'http://www.jqwidgets.com/jquery-widgets-demo/demos/jqxgrid/index.htm#demos/jqxgrid/columnsresizing.htm'},
      edit: {support: true, link: 'http://www.jqwidgets.com/jquery-widgets-demo/demos/jqxgrid/index.htm#demos/jqxgrid/spreadsheet.htm'},
      responsive: false,
      i18n: {support: true, link: 'http://www.jqwidgets.com/jquery-widgets-demo/demos/jqxgrid/index.htm#demos/jqxgrid/localization.htm'},
      keyboard: {support: true, link: 'http://www.jqwidgets.com/jquery-widgets-demo/demos/jqxgrid/index.htm#demos/jqxgrid/keyboardsupport.htm'},
      plugins: undefined,
      meteor: undefined
    });

    Tables.insert({
      name: 'Backgrid.js - reactive, Backbone UI',
      url: 'http://backgridjs.com/',
      multisort: {support: false, link: 'https://github.com/wyuenho/backgrid/issues/453'},
      pages: {support: true, link: 'https://github.com/wyuenho/backgrid-paginator'},
      filter: {support: true, link: 'https://github.com/wyuenho/backgrid-filter'},
      resize: false,
      edit: {support: true, link: 'http://backgridjs.com/index.html#complete-example'},
      responsive: undefined,
      i18n: undefined,
      keyboard: false,
      plugins: undefined,
      meteor: {support: false, link: 'https://atmospherejs.com/?q=backgrid'}
    });

    Tables.insert({
      name: 'Tabular',
      url: 'https://github.com/aldeed/meteor-tabular',
      multisort: {support: false, link: 'https://github.com/aldeed/meteor-tabular/issues/144'},
      pages: true,
      filter: true,
      resize: {support: false, link: 'https://github.com/aldeed/meteor-tabular/issues/146'},
      edit: {support: false, link: 'https://github.com/aldeed/meteor-tabular/issues/145'},
      responsive: true,
      i18n: {support: undefined, link: 'https://github.com/aldeed/meteor-tabular/issues/147'},
      keyboard: {support: undefined, link: 'https://github.com/aldeed/meteor-tabular/issues/148'},
      plugins: {support: true, link: 'http://datatables.net/extensions/index'},
      meteor: true
    });
    
  });
}
