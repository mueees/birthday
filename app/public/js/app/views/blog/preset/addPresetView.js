define([
    'marionette',
    'text!app/templates/blog/preset/addPreset.html',
    'validate'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click .addPreset": "addPresetBtn",
            "click .clear": "clearBtn"
        },

        ui: {
            form: ".addPresetForm",
            name: ".name",
            classes: ".classes",
            width: ".width"
        },

        initialize: function(){

        },

        onRender: function(){
            this.addValidate();
        },

        addValidate: function(){
            var form = this.ui.form;
            form.validate({
                rules: {
                    name: {
                        minlength: 3
                    },
                    classes: "required",
                    width: "required"
                }
            });
        },

        clearBtn: function(e){
            if(e) e.preventDefault();

            this.ui.name.val("");
            this.ui.classes.val("");
            this.ui.width.val("");
        },

        getData: function(){
            return {
                name: this.ui.name.val(),
                classes: this.ui.classes.val(),
                width: this.ui.width.val()
            }
        },

        valid: function(){
            var form = this.ui.form;
            return form.valid();
        },

        addPresetBtn: function(e){
            if(e) e.preventDefault();

            if( this.valid() ){
                this.trigger("addNewPreset", this.getData());
            }else{
                console.log('WTF!');
            }
            return false;
        }
    })

})