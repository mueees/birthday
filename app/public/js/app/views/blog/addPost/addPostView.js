define([
    'marionette',
    'text!app/templates/blog/addPost/addPost.html',
    'datepicker'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click .btnAddPost": "addPost",
            "focus .tags:last": "lastTagFocus",
            "blur .tags": "tagBlur"
        },

        tagTemplate: _.template('<input class="tags" type="text" name="tags[]" placeholder="tag" />'),

        ui: {
            "form" : ".addPostForm",
            "title": "#title",
            "date": "#date",
            "body": "#body",
            "previewImg": "#previewImg",
            "previewTitle": "#previewTitle",
            "preset": "#preset",
            "tags": "input[name='tags[]']"
        },

        initialize: function(){

        },

        onRender: function(){
            this.addValidate();
            this.addDatePickerDate();
        },

        addValidate: function(){
            var form = this.ui.form;
            form.validate({
                rules: {
                    title: {
                        minlength: 3
                    }
                }
            });
        },

        addDatePickerDate: function(){
            this.ui.date.datepicker().datepicker("setValue", new Date());
        },

        lastTagFocus: function(e){
            var newTagView = this.tagTemplate();
            this.$el.find(".tags-container .controls").append( newTagView );
        },

        tagBlur: function(e){
            var tag = $(e.target);
            if($.trim(tag.val()) == "" ) tag.remove();
        },

        getData: function( defPost ){

            var defImg = $.Deferred();
            var _this = this;

            defImg.done(function( imgDate ){

                var data = {
                    title: _this.ui.title.val(),
                    date: _this.ui.date.val(),
                    body: _this.ui.body.val(),
                    previewTitle: _this.ui.previewTitle.val(),
                    previewImg: imgDate,
                    preset: _this.ui.preset.val(),
                    tags: _this.getTags()
                };

                defPost.resolve(data);
            })

            this.getPreviewImgInfo( defImg );
        },

        getTags: function(){

            var tags = this.$el.find(".tags");
            var result = [];
            for( var i = 0; i < tags.length; i++ ){
                var value = $.trim(tags[i].value);

                if( value != "" ){
                    result.push( value )
                }
            }

            return result;
        },

        getPreviewImgInfo: function( defImg ){
            var img = this.ui.previewImg[0].files[0];

            if( !img ) {
                defImg.resolve("");
                return false;
            }

            var fr = new FileReader();
            fr.onload = function(){
                defImg.resolve(fr.result);
            };
            fr.readAsDataURL( img );
            return false;
        },

        valid: function(){
            var form = this.ui.form;
            return form.valid();
        },

        addPost: function(e){
            if(e) e.preventDefault();
            var _this = this;

            if( this.valid() ){
                var defPost = $.Deferred();
                this.getData(defPost);

                defPost.done(function(data){
                    _this.trigger("addNewPost", data);
                });
            }else{
                console.log('WTF!');
            }
            return false;
        }
    })

})