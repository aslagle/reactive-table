Package.describe({
  summary: "A reactive table designed for Meteor",
  version: "0.4.7",
  name: "aslagle:reactive-table",
  git: "https://github.com/ecohealthalliance/reactive-table.git"
});

Package.on_use(function (api) {
  api.versionsFrom("METEOR@0.9.0");
    api.use('templating', 'client');
    api.use('jquery', 'client');
    api.use('underscore', 'client');
    api.use("anti:i18n@0.4.3", 'client');

    api.add_files('lib/reactive_table.html', 'client');
    api.add_files('lib/reactive_table_i18n.js', 'client');
    api.add_files('lib/reactive_table.js', 'client');
    api.add_files('lib/reactive_table.css', 'client');
});
