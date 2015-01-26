if (Meteor.isClient) {

    Template.clearFiltersButton.events({
       "click #clear-filters-button" : function () {
           ReactiveTable.clearFilters(['filter1', 'filter2', 'filter3', 'date-filter', 'checkbox-filter']);
       }
    });
    
}