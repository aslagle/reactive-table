if (Meteor.isClient) {
  Template.selectFilter.created = function () {
    this.filter = new ReactiveTable.Filter('select-filter', ['score']);  
  };

  Template.selectFilter.events({
     "change .select-filter": function (event, template) {
       template.filter.set($(event.target).val());
     } 
  });
}