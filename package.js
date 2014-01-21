Package.describe({
    summary: "A reactive table designed for Meteor"
});

Package.on_use(function (api) {
    api.use('templating', 'client');
    api.use('handlebars', 'client');
    api.use('jquery', 'client');
    api.use('underscore', 'client');

    api.add_files('lib/reactive_table.html', 'client');
    api.add_files('lib/reactive_table.js', 'client');
    api.add_files('lib/reactive_table.css', 'client');
});