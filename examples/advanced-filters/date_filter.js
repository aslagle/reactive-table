if (Meteor.isClient) {
    Template.dateFilter.created = function () {
      this.filter = new ReactiveTable.Filter('date-filter', ['date']);  
    };
    
    Template.dateFilter.events({
       "change .date-selector": function (event, template) {
           template.filter.set($(event.target).val());
       } 
    });
}