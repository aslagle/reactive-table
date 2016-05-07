
# Child (Sub) Tables

This guide shows how to add child/sub tables, this simply inserts a new row when expanded.
You can control the expand/collapse control and render an array on your data structure or
simply pass in a template for the sub table and handle it yourself.

*Note: This currently does not work with sorting or server side paging, only use this with static data*


**Requirements:**

- Your data must have a unique `_id` field, if you're using a Collection this shouldn't be an issue


### Expand Button Setup

There are 2 implementations of the expand button
 
 
#### Simple Prepended Icon

On any field you can add the setting `expandButton`

Set `useFontAwesome = true` in the settings for a better icon
[https://github.com/aslagle/reactive-table#settings](https://github.com/aslagle/reactive-table#settings)



    fields: [
    
      {
        key: 'store_name',
        label: 'Store Name',
        expandButton: true
      },
      ...
    ]

By itself this will prepend an expand/collapse icon to the cell.

This respects the virtual column's `fn` function, if you use this it will prepend the icon to the result.



#### Custom Expand Button Template

First `expandButton` must be set to true, and if you are using a Template, 
we will automatically pass in to the template data two helper functions
 
- `expandChildren` - show the child / sub table
- `collapseChildren` - hide the above

For example I can pass in my own template:

    fields: [
        
          {
            key: 'store_name',
            label: 'Store Name',
            expandButton: true,
            tmpl: Template.StoreExpandCell
          },
          ...
        ]

And then in my template I can create an event, where `this.expandChildren` and `this.collapseChildren()`
are accessible. You can save your state however you wish, in my case I am using the DOM.
    
    
    Template.StoreExpandCell.events({
    
      'click .my-expand-control': function( ev, t ){
    
        var divContainer = $(ev.currentTarget);
        var iconExpand = divContainer.find('.expand-icon');
    
        if (!!divContainer.data('expanded')) {
          iconExpand.removeClass( 'fa-minus-square-o' ).addClass( 'fa-plus-square-o' );
          divContainer.data('expanded', false);
          this.collapseChildren();
        }
        else {
          iconExpand.removeClass( 'fa-plus-square-o' ).addClass( 'fa-minus-square-o' );
          divContainer.data('expanded', true);
          this.expandChildren();
        }
    
      }
    
    });
    
    
### Child/Sub Table Setup
 
You have two options for the contents of the child table, either a simple table rendered with the default reactive-table fields options
or a custom template

The child table settings are added with the reactive-table setting `children` 


#### Child Table

For a child table you need two settings in `children`, these are `dataField` and `fields` 

`dataField` - this must be a field referencing an array of structs, for example if I have the following data
 
    [
      {
        _id: 1,
        store_name: 'ABC Store',
        store_locations: [
          {
            _id: 1000,
            city: 'San Francisco'
          },
          ...
        ]
      },
      {
        _id: 2,
        store_name: 'Tom\'s Hardware'
        store_locations: [
          {
            _id: 1001,
            city: 'New York'
          }
          ...
        ]
      }
      ...
    ]



`fields` - similar to the `fields` setting on the parent table, all the same functionality is retained such as
virtual columns, templates and styling options


    fields: [
        
      {
        key: 'store_name',
        label: 'Store Name',
        expandButton: true,
        tmpl: Template.StoreExpandCell
      },
      ...
    ],
    
    children: {
      dataField: 'store_locations',
      fields: [
        {
          key: 'city',
          label: 'Location'
        }
        ...
      ]
    }



#### Custom Template

Simply add the template to a `children` field, and the entire data object will be passed into your specified template
for you to reference

    fields: [
        
      {
        key: 'store_name',
        label: 'Store Name',
        expandButton: true,
        tmpl: Template.StoreExpandCell
      },
      ...
    ],
    
    children: {
      tmpl: Template.StoreLocations
    }
    




