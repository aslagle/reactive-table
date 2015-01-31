if (Meteor.isClient) {
  Template.compoundFilter.created = function () {
    this.checkFilter = new ReactiveTable.Filter('compound-check-filter', ['checked']);
    this.scoreFilter = new ReactiveTable.Filter('compound-score-filter', ['score']);
  };

  Template.compoundFilter.helpers({
    checked: function () {
      var checkTrue = Template.instance().checkFilter.get() === "true";
      var scoreTrue = _.isObject(Template.instance().scoreFilter.get());
      if (checkTrue && scoreTrue) {
        return "checked";
      } 
      return "";
    } 
  });

  Template.compoundFilter.events({
    "change .compound-checkbox": function (event, template) {
      if ($(event.target).is(":checked")) {
        template.checkFilter.set("true");
        template.scoreFilter.set({'$gt': 20});
      } else {
        template.checkFilter.set("");
        template.scoreFilter.set("");
      }
    } 
  });
}