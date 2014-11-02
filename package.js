Package.describe({
  summary: "A reactive table designed for Meteor",
  version: "0.5.4",
  name: "aslagle:reactive-table",
  git: "https://github.com/ecohealthalliance/reactive-table.git"
});

Package.on_use(function (api) {
    api.versionsFrom("METEOR@0.9.0");
    api.use('templating', 'client');
    api.use('jquery', 'client');
    api.use('underscore', 'client');
    api.use('reactive-var@1.0.3', 'client');
    api.use("anti:i18n@0.4.3", 'client');

    api.add_files('lib/reactive_table.html', 'client');
    api.add_files('lib/reactive_table_i18n.js', 'client');
    api.add_files('lib/reactive_table.js', 'client');
    api.add_files('lib/reactive_table.css', 'client');
});

Package.on_test(function (api) {
    api.use('templating', 'client');
    api.use('jquery', 'client');
    api.use('underscore', 'client');
    api.use('reactive-var@1.0.3', 'client');
    api.use("anti:i18n@0.4.3", 'client');

    api.add_files('lib/reactive_table.html', 'client');
    api.add_files('lib/reactive_table_i18n.js', 'client');
    api.add_files('lib/reactive_table.js', 'client');
    api.add_files('lib/reactive_table.css', 'client');

    api.use(['tinytest', 'test-helpers'], 'client');
    api.add_files('test/helpers.js', 'client');
    api.add_files('test/test_collection_argument.js', 'client');
    api.add_files('test/test_settings.js', 'client');
    api.add_files('test/test_fields_tmpl.html', 'client');
    api.add_files('test/test_fields.js', 'client');
    api.add_files('test/test_reactivity.js', 'client');
    api.add_files('test/test_sorting.js', 'client');
    api.add_files('test/test_filtering.js', 'client');
    api.add_files('test/test_pagination.js', 'client');
    api.add_files('test/test_i18n.js', 'client');
    api.add_files('test/test_events_tmpl.html', 'client');
    api.add_files('test/test_events.js', 'client');
    api.add_files('test/test_column_toggles.js', 'client');
    api.add_files('test/test_multiple_tables.js', 'client');
    api.add_files('test/test_template.html', 'client');
    api.add_files('test/test_template.js', 'client');
});
