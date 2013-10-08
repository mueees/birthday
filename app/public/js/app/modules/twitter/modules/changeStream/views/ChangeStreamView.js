define([
    'marionette',
    'text!../templates/ChangeStreamView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click .cancel": "cancelBtn",
            "click .btnChangeStream": "btnChangeStream"
        },

        ui: {
            "name": '#name',
            'track': '#track',
            'language': '.lang'
        },

        initialize: function(options){
            this.channel = options.channel;
            _.bind(this.btnChangeStream, this);
        },

        onRender: function(){

        },

        cancelBtn: function(){
            this.close();
        },

        getData: function(){
            return {
                track: $.trim(this.ui.track.val()),
                name: $.trim(this.ui.name.val()),
                language: this.getLangList()
            }
        },

        getLangList: function(){
            var elements = this.ui.language.filter(":checked");
            var result = [];

            for( var i = 0; i < elements.length; i++ ){
                result.push( elements[i].value )
            }

            return result;
        },

        btnChangeStream: function(){
            var _this = this;
            this.model.save(this.getData(), {
                wait: true,
                error: function(){
                    _this.channel.trigger("showMessage", "Cannot update stream")
                },
                success: function(){
                    _this.channel.trigger("showMessage", "Stream updated")
                }
            });
            this.close();
        }
    })

})