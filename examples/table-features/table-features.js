var Tables = new Meteor.Collection('features');

if (Meteor.isClient) {
  Template.featureComparison.tables = function () {
    return Tables;
  };

  var checkOrX = function (value) {
    var html = '<span style="color:red">&#10008;</span>'
    if (value) {
      html = '<span style="color:green">&#10004;</span>'
    }
    return new Handlebars.SafeString(html);
  };

  Template.featureComparison.tableSettings = function () {
    return {
      fields: [
        { 
          key: 'name',
          label: 'Library',
          fn: function (name, object) {
            var html = '<a name="' + name +'" target="_blank" href="' + object.url + '">' + name + '</a>';
            return new Handlebars.SafeString(html);
          }
        },
        { key: 'sort', label: 'Sorting', fn: checkOrX },
        { key: 'pages', label: 'Pagination', fn: checkOrX },
        { key: 'filter', label: 'Filtering/Search', fn: checkOrX },
        { key: 'resize', label: 'Resizable Columns', fn: checkOrX },
        { key: 'edit', label: 'Inline Editing', fn: checkOrX },
        { key: 'responsive', label: 'Mobile/Responsive Support', fn: checkOrX },
        { key: 'i18n', label: 'Internationalization Support', fn: checkOrX },
        { key: 'meteor', label: 'Meteor Integration', fn: checkOrX }
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
      'i18n': true,
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
      'i18n': true

    });

    Tables.insert({
      'name': 'SlickGrid',
      'url': 'https://github.com/mleibman/SlickGrid',
      'sort': true,
      'filter': true,
      'resize': true,
      'edit': true
    });

    Tables.insert({
      'name': 'Dynatable',
      'url': 'http://www.dynatable.com/',
      'sort': true,
      'pages': true,
      'filter': true
    });

    Tables.insert({
      'name': 'tablesorter',
      'url': 'https://github.com/Mottie/tablesorter',
      'sort': true,
      'filter': true,
      'edit': true
    });

    Tables.insert({
      'name': 'Handsontable',
      'url': 'http://handsontable.com/',
      'sort': true,
      'pages': true,
      'resize': true,
      'edit': true
    });
  });
}