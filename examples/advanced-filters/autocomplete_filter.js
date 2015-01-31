if (Meteor.isClient) {
  Template.autocompleteFilter.created = function () {
    this.filter = new ReactiveTable.Filter('autocomplete-filter', ['name']);  
  };
  
  Template.autocompleteFilter.helpers({
    settings: function () {
      var filter = Template.instance().filter;
      return {
        position: "top",
        limit: 5,
        rules: [
          {
            collection: Players,
            field: "name",
            template: Template.namePill,
            callback: function(doc) {
              return filter.set(doc.name);
            }
          }
        ]
      };
    }
  });

  Template.autocompleteFilter.events({
     "input #name-autocomplete-filter": function (event, template) {
        var input = $(event.target).val();
        if (input) {
          template.filter.set(input);
        } else {
          template.filter.set("");
        }
     } 
  });
}