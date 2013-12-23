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

                if( data.type == "user" ){

                    if( date.getMonth() == data.dateStart.dateStartObj.getMonth() &&
                        date.getDate() == data.dateStart.dateStartObj.getDate()) {
                        result.push(event.toJSON());
                    }
                }else{
                    if( date.valueOf() == data.dateStart.dateStartObj.valueOf() ) result.push(event.toJSON());
                }


            })
            return result;

        },

        parse: function(response){
            for( var i = 0; i < response.length; i++ ){
                var event = response[i];
                event.unique = i;

                event.dateStart.dateStartObj = new Date(event.dateStart.dateStartObj);
                this.push(event);
            }

            return this.models;
        }
    })

})