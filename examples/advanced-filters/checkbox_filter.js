if (Meteor.isClient) {
    Template.checkboxFilter.created = function () {
      this.filter = new ReactiveTable.Filter('checkbox-filter', ['checked']);  
    };
    
    Template.checkboxFilter.helpers({
      checked: function () {
        if (Template.instance().filter.get() === "true") {
          return "checked";
        } 
        return "";
      } 
    });
    
    Template.checkboxFilter.events({
       "change .checkbox-filter": function (event, template) {
           if ($(event.target).is(":checked")) {
               template.filter.set("true");
           } else {
               template.filter.set("");
           }
       } 
    });
}