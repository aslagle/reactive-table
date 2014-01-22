# Reactive Table
A reactive table designed for Meteor.

## Quickstart

Install reactive table:

    mrt add reactive-table
    

This package adds a handlebars helper called reactiveTable. Create and subscribe to a collection, and pass it to the helper in a template:

    {{reactiveTable myCollection}}
    
When the whole collection should be in the table, it's best to pass in the Meteor collection object (returned by new Meteor.Collection()). You can also pass in the cursor returned by collection.find() to show a subset of the collection, or a plain array to show data that's not in a Meteor collection.

## Customization

### Styling

Add bootstrap or bootstrap-3 to style the table, or add your own css. The generated table will have the class 'reactive-table'.

### Setting columns

To specify columns, pass in an additional fields argument: 

    {{reactiveTable collection fields}}.

Fields can simply be an array of field names (attributes in the collection).

    ['name', 'location', 'year']
    
#### Setting column headers
    
To set labels for the column headers, use an array of field elements, each with a key (the attribute in the collection) and a label (to display in the table header). 

    [
        { key: 'name', label: 'Name' },
        { key: 'location', label: 'Location' },
        { key: 'year', label: 'Year' }
    ]

#### Virtual columns

You can also compute a function on the attribute's value to display in the table, by adding fn to the field.

    [
        { 
            key: 'resources',
            label: 'Number of Resources',
            fn: function (value) { return value.length; }
        }
    ]
    
#### Nested objects and arrays

For elements of nested objects and arrays, use mongo's syntax in the key: 

    {'key': 'emails.0.address', label: 'Email Address'}

### Adding additional data to the table

If you need to store additional data in the table, you can add attributes to a row's html, by passing an attributes argument: 

    {{reactiveTable collection fields attrs}}
    


attrs should be an object, with the html attribute names as keys and the collection keys as values.

    { 'element-id': '_id' }
