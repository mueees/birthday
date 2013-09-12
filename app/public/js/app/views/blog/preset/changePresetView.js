define([
    'marionette',
    'text!app/templates/blog/preset/changePreset.html',
    'validate'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click .changePreset": "changePresetBtn",
            "click .cancel": "cancelBtn"
        },

        ui: {
            form: ".changePresetForm",
            name: ".name",
            classes: ".classes",
            width: ".width"
        },

        initialize: function(){
            _.bind(this.successChange, this);
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

        cancelBtn: function(e){
            if(e) e.preventDefault();

            this.$el.remove();
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

        changePresetBtn: function(e){
            if(e) e.preventDefault();
            var _this = this;

            if( this.valid() ){
                var data = this.getData();

                this.model.set(data, {silent: true});
                this.model.save(null, {
                    success: function(){
                        _this.trigger("successChange");
                        _this.close();
                    }
                });

            }else{
                console.log('WTF!');
            }
            return false;
        },

        successChange: function(){

        }
    })

})