# Reactive Table
A reactive table designed for Meteor.

Demo and Feature Comparison: http://reactive-table.meteor.com/

Another Demo: http://reactive-table-leaderboard.meteor.com/

## Quick Start

Install reactive table:

    mrt add reactive-table
    

This package adds a handlebars helper called reactiveTable. Create and subscribe to a collection, and pass it to the helper in a template:

    {{reactiveTable myCollection}}
    
When the whole collection should be in the table, it's best to pass in the Meteor collection object (returned by new Meteor.Collection()). You can also pass in the cursor returned by collection.find() to show a subset of the collection, or a plain array to show data that's not in a Meteor collection.


## Styling

Add bootstrap or bootstrap-3 to style the table, or add your own css. The generated table will have the class 'reactive-table'.


## Customization

The reactiveTable helper accepts an additional settings argument that can be used to configure the table.

    {{reactiveTable collection settings}}

Define the settings in a helper for the template that calls reactiveTable:

    Template.myTemplate.helpers({
        settings: function () {
            return { fields: ['name', 'location', 'year'] };
        }
    });


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
    
#### Nested objects and arrays

For elements of nested objects and arrays, use mongo's syntax in the key: 

    {'key': 'emails.0.address', label: 'Email Address'}

### Adding additional data to the table

If you need to store additional data in the table, you can add attributes to a row's html, by adding an attributes argument to the settings. 

attrs should be an object, with the html attribute names as keys and the collection keys as values.

    { 
        fields: [...],
        attrs:  { 'element-id': '_id' }
    }


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
    
French is the only language we currently have a translation for. To set your language to French:

    i18n.setLanguage('fr');
    
For other languages, contribute a translation to [reactive_table_i18n.js](https://github.com/ecohealthalliance/reactive-table/blob/master/lib/reactive_table_i18n.js).
