if (Meteor.isClient) {
  Template.greaterThanFilter.created = function () {
    this.filter = new ReactiveTable.Filter('greater-than-filter', ['score']);  
  };

  Template.greaterThanFilter.events({
     "keyup .greater-than-filter-input, input .greater-than-filter-input": function (event, template) {
        var input = parseInt($(event.target).val(), 10);
        if (!_.isNaN(input)) {
          template.filter.set({'$gt': input});
        } else {
          template.filter.set("");
        }
     } 
  });
}