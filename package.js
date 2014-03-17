Package.describe({
    summary: "A reactive table designed for Meteor"
});

function packageExists(pkgname) {
    var fs = Npm.require('fs');
    var path = Npm.require('path');
    var pkgpath = path.join('packages', pkgname);
    return fs.existsSync(pkgpath);
}

Package.on_use(function (api) {
    api.use('templating', 'client');
    api.use('handlebars', 'client');
    api.use('jquery', 'client');
    api.use('underscore', 'client');
    api.use('just-i18n', 'client');

    if (packageExists('font-awesome')) {
        api.add_files('lib/reactive_table_fa.html', 'client');
        api.add_files('lib/reactive_table_fa.css', 'client');
    } else {
        api.add_files('lib/reactive_table.html', 'client');
        api.add_files('lib/reactive_table.css', 'client');
    }
    api.add_files('lib/reactive_table_i18n.js', 'client');
    api.add_files('lib/reactive_table.js', 'client');
});
