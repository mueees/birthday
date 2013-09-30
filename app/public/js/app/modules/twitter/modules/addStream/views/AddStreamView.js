define([
    'marionette',
    'text!../templates/AddStreamView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click .cancel": "cancelBtn",
            "click .btnAddStream": "btnAddStream"
        },

        ui: {
            "name": '#name',
            'text': '#text',
            'people': '#people',
            'language': '.lang'
        },

        initialize: function(options){
            this.channel = options.channel;
        },

        onRender: function(){

        },

        cancelBtn: function(){
            this.close();
        },

        getData: function(){
            return {
                text: $.trim(this.ui.text.val()),
                name: $.trim(this.ui.name.val()),
                people: $.trim(this.ui.people.val()),
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

        btnAddStream: function(){
            this.channel.trigger("saveNewStream", this.getData());
            this.close();
        }
    })

})