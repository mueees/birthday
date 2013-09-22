define([
    'marionette',
    'text!app/templates/menu/MenuView.html'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {

        },

        ui: {
            "li": "li",
            "publicLi": "li[data-private='public']"
        },

        initialize: function(data){
            this.channel = data.channel;
            this.region = data.region;
            this.state = data.state;

            this.listenTo(this.channel, "changeLoginState", this.changeLoginState)
            this.region.show(this);
        },

        changeLoginState: function(data){
            this.state = data.state;
            this.renderState();
        },

        onRender: function(){
            this.renderState();
        },

        renderState: function(){

            if(this.state){
                this.ui.li.show();
            }else{
                this.ui.li.hide();
                this.ui.publicLi.show();
            }

        }
    })

})