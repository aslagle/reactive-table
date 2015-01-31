if (Meteor.isClient) {
  Template.quoteFilter.created = function () {
    this.filter = new ReactiveTable.Filter('quote-filter');  
  };

  Template.quoteFilter.events({
     "keyup .quote-filter-input, input .quote-filter-input": function (event, template) {
        var input = $(event.target).val();
        if (input) {
          template.filter.set('"' + input + '"');
        } else {
          template.filter.set("");
        }
     } 
  });
}