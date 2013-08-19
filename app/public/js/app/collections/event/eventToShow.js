define([
    'app/app',
    'backbone',
    'marionette',
    'app/models/event/eventToShow',
    'app/collections/_base/collection'
],function(App, Backbone, Marionette, EventToShowModel, BaseColletion){

    return BaseColletion.extend({
        model: EventToShowModel,
        url: App.config.api.getEventToShow,

        getEventsByDate: function(date){
            var result = [];
            this.each(function(event){
                var data = event.toJSON();
                if( date.valueOf() == data.dateStart.dateStartObj.valueOf() ) result.push(event.toJSON());
            })
            return result;

        },

        parse: function(response){
            _.map(response, function(event) {
                event.dateStart.dateStartObj = new Date(event.dateStart.dateStartObj);
            });
            return response;
        }
    })

})