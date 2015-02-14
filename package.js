Package.describe({
  summary: "A reactive table designed for Meteor",
  version: "0.6.6",
  name: "aslagle:reactive-table",
  git: "https://github.com/aslagle/reactive-table.git"
});

Package.on_use(function (api) {
    api.versionsFrom("METEOR@0.9.0");
    api.use('templating', 'client');
    api.use('jquery', 'client');
    api.use('underscore', 'client');
    api.use('reactive-var@1.0.3', 'client');
    api.use("anti:i18n@0.4.3", 'client');
    api.use("mongo@1.0.8", ["server", "client"]);

    api.use("fortawesome:fontawesome@4.2.0", 'client', {weak: true});

    api.add_files('lib/reactive_table.html', 'client');
    api.add_files('lib/reactive_table_i18n.js', 'client');
    api.add_files('lib/reactive_table.js', 'client');
    api.add_files('lib/reactive_table.css', 'client');
    api.add_files('lib/filter.js', ['client', 'server']);
    api.add_files('lib/server.js', 'server');

    api.export("ReactiveTable", "server");
});

Package.on_test(function (api) {
    api.use('templating', 'client');
    api.use('jquery', 'client');
    api.use('underscore', ['client', 'server']);
    api.use('reactive-var@1.0.3', 'client');
    api.use("anti:i18n@0.4.3", 'client');
    api.use("mongo", ["server", "client"]);

    api.add_files('lib/reactive_table.html', 'client');
    api.add_files('lib/reactive_table_i18n.js', 'client');
    api.add_files('lib/reactive_table.js', 'client');
    api.add_files('lib/reactive_table.css', 'client');
    api.add_files('lib/filter.js', ['client', 'server']);
    api.add_files('lib/server.js', 'server');

    api.export("ReactiveTable", "server");

    api.use(['tinytest', 'test-helpers'], 'client');
    api.add_files('test/helpers.js', ['client', 'server']);
    api.add_files('test/test_collection_argument.js', 'client');
    api.add_files('test/test_settings.js', 'client');
    api.add_files('test/test_fields_tmpl.html', 'client');
    api.add_files('test/test_fields.js', 'client');
    api.add_files('test/test_reactivity_server.js', 'server');
    api.add_files('test/test_reactivity.html', 'client');
    api.add_files('test/test_reactivity.js', 'client');
    api.add_files('test/test_sorting.js', 'client');
    api.add_files('test/test_filtering_server.js', 'server');
    api.add_files('test/test_filtering.js', 'client');
    api.add_files('test/test_pagination.js', 'client');
    api.add_files('test/test_i18n.js', 'client');
    api.add_files('test/test_events_tmpl.html', 'client');
    api.add_files('test/test_events.js', 'client');
    api.add_files('test/test_column_toggles.js', 'client');
    api.add_files('test/test_multiple_tables.js', 'client');
    api.add_files('test/test_template.html', 'client');
    api.add_files('test/test_template.js', 'client');

    api.use("dburles:collection-helpers@1.0.1", "client");
    api.add_files("test/test_compatibility.js", "client");
});
