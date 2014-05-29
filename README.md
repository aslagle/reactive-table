# Reactive Table
A reactive table designed for Meteor.

Demo and Feature Comparison: http://reactive-table.meteor.com/

Another Demo: http://reactive-table-leaderboard.meteor.com/

### Note on Versions
The latest version of reactive-table only supports Meteor version 0.8.0 or higher.
For older versions of Meteor, you can use reactive-table v0.2.5 ([documentation](https://github.com/ecohealthalliance/reactive-table/tree/v0.2.5)).
If you're updating to Meteor 0.8.0, note that reactiveTable is now a template with keyword arguments rather than a helper. The functionality should be the same, but please report bugs in the issues.

### Table of Contents
- [Quick Start](#quick-start)
- [Customization](#customization)
  - [Settings](#settings)
  - [Styling](#styling)
  - [Setting columns](#setting-columns)
    - [Setting column headers](#setting-column-headers)
    - [Templates](#templates)
    - [Virtual columns](#virtual-columns)
      - [HTML](#html)
    - [Nested objects and arrays](#nested-objects-and-arrays)
- [Using events](#using-events)
- [Multiple tables](#multiple-tables)
- [Internationalization](#internationalization)

## Quick Start

Install reactive table:

    mrt add reactive-table


This package adds a template called reactiveTable. Create and subscribe to a collection, and pass it to the template:

    {{> reactiveTable collection=myCollection}}

When the whole collection should be in the table, it's best to pass in the Meteor collection object (returned by new Meteor.Collection()). You can also pass in the cursor returned by collection.find() to show a subset of the collection, or a plain array to show data that's not in a Meteor collection.



## Customization

The reactiveTable helper accepts an additional settings argument that can be used to configure the table.

    {{> reactiveTable collection=collection settings=settings}}

Define the settings in a helper for the template that calls reactiveTable:

    Template.myTemplate.helpers({
        settings: function () {
            return {
                rowsPerPage: 10,
                showFilter: true,
                fields: ['name', 'location', 'year']
            };
        }
    });


### Settings

* `showFilter`: Boolean. Whether to display the filter box above the table. Default `true`.
* `rowsPerPage`: Number.  The desired number of rows per page. Defaults to 10.
* `showNavigation`: 'always', 'never' or 'auto'.  The latter shows the navigation footer only if the collection has more rows than `rowsPerPage`.
* `fields`: Object. Controls the columns; see below.
* `useFontAwesome`: Boolean. Whether to use [Font Awesome](http://fortawesome.github.io/Font-Awesome/) for icons. Requires the `font-awesome` package to be installed. Default `false`.
* `rowId`: Boolean. If `true` the row gets an `id` tag that contains the document `_id` from the collection
* `rowClass`: add classes to every table row, e.g. `link`

### Styling

Add bootstrap or bootstrap-3 to style the table, or add your own css. The generated table will have the class 'reactive-table'. To use [Font Awesome](http://fortawesome.github.io/Font-Awesome/) for icons, also add the font-awesome package and set `useFontAwesome` to `true` in the settings.


### Setting columns

To specify columns, add a fields key to the settings object.


Fields can simply be an array of field names (attributes in the collection).

    { fields: ['name', 'location', 'year'] }


#### Setting column headers

To set labels for the column headers, use an array of field elements, each with a key (the attribute in the collection) and a label (to display in the table header).

    { fields: [
        { key: 'name', label: 'Name' },
        { key: 'location', label: 'Location' },
        { key: 'year', label: 'Year' }
    ] }



#### Templates

You can specify a template to use to render cells in a column, by adding `tmpl` to the field options.

    { fields: [
        { key: 'name', label: 'Name', tmpl: Template.nameTmpl },
        { key: 'location', label: 'Location', tmpl: Template.locationTmpl }
    ] }

The template's context will be the full object, so it will have access to all fields.

#### Virtual columns

You can also compute a function on the attribute's value to display in the table, by adding `fn` to the field.

    { fields: [
        {
            key: 'resources',
            label: 'Number of Resources',
            fn: function (value, object) { return value.length; }
        }
    ] }

If the key exists in the record, it will be passed to `fn` in `value`. Otherwise, `value` will be `null`.

The `object` argument contains the full object, so you can compute a value using multiple fields.

##### HTML

You can use HTML in a virtual column by creating a Spacebars SafeString:

    fn: function (value) {
        return new Spacebars.SafeString('<a href="+Routes.route['view'].path({_id:value})+">View</a>');
    }

When adding user-generated fields to the HTML, ensure that they have been properly escaped to prevent cross-site scripting vulnerabilities.

#### Default sorting

You can use a column as the default sort order by adding `sort` to the field:

    { fields: [
        { key: 'year', label: 'Year', sort: 'descending' }
    ] }

It will accept any truthy value for ascending order, and `'desc'`, `'descending'` or `-1` for descending order.

#### Nested objects and arrays

For elements of nested objects and arrays, use mongo's syntax in the key:

    {'key': 'emails.0.address', label: 'Email Address'}



## Using events

Make the event selector be `tr`, and you'll have your row object in `this`:

```JavaScript
Template.posts.events({
  'click .reactive-table tr': function (event) {
    // set the blog post we'll display details and news for
    var post = this;
    Session.set('post', post);
  }
});
```

## Multiple tables

When multiple tables are used in the same application, by default they'll share pagination settings and filters. Add a different group to each table's settings to allow separate table state.

    {
        fields: [...],
        group:  'resources'
    }

The default group is 'reactive-table'.

## Internationalization

Internationalization support is provided using [just-i18n](https://github.com/subhog/meteor-just-i18n).

Add just-i18n to your project:

    mrt add just-i18n

To set your language to French:

    i18n.setLanguage('fr');

We currently have translations for:

- Brazilian Portuguese (pt-br)
- Dutch (nl)
- French (fr)
- Italian (it)
- Russian (ru)
- Spanish (es)
- Swedish (sv)
- Turkish (tr)
- Ukrainian (ua)

For other languages, contribute a translation to [reactive_table_i18n.js](https://github.com/ecohealthalliance/reactive-table/blob/master/lib/reactive_table_i18n.js).
