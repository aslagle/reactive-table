if (Meteor.isClient) {
    Template.dateFilter.created = function () {
      this.filter = new ReactiveTable.Filter('date-filter', ['date']);  
    };
  
    Template.dateFilter.rendered = function () {
      $('.date-selector').datepicker();
    };
    
    Template.dateFilter.events({
       "change .date-selector": function (event, template) {
           if ($(event.target).val()) {
             var date = moment($(event.target).val());
             template.filter.set(date.format("YYYY-MM-DD"));
           } else {
             template.filter.set("");
           }
       } 
    });
}