define([
    'marionette',
    'text!app/templates/blog/changePost/ChangePostView.html',

    'datepicker',
    'validate',
    'ckeditor'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        tagTemplate: _.template('<input class="tags" type="text" name="tags[]" placeholder="tag" />'),

        events: {
            'click .btnChangePost': "btnChangePost",
            'click .btnCancel': 'btnCancel',
            "focus .tags:last": "lastTagFocus",
            "blur .tags": "tagBlur",
            "click .chooseFile": "chooseFile"
        },

        ui: {
            "form" : ".changePostForm",
            "title": "#title",
            "date": "#date",
            "body": "#body",
            "previewImg": "#previewImg",
            "previewTitle": "#previewTitle",
            "preset": "#preset",
            "tags": "input[name='tags[]']"
        },

        initialize: function(data){
            data.model.set('presets', data.presets.toJSON());

        },

        onRender: function(){
            this.addValidate();
            this.addDatePickerDate();
            this.addCkeEditor();
        },

        addValidate: function(){
            var form = this.ui.form;
            form.validate({
                rules: {
                    title: {
                        minlength: 3
                    },
                    preset: "required"
                }
            });
        },

        addCkeEditor: function(){
            var _this = this;
            setTimeout(function(){
                _this.body = CKEDITOR.replace('body', {
                    filebrowserBrowseUrl : '/fileBrowser.html'
                });
                _this.title = CKEDITOR.replace('title', {toolbar :
                    [
                        { name: 'document', items : [ 'Source' ] },
                        { name: 'links', items : [ 'Link','Unlink','Anchor' ] },
                        { name: 'styles', items : [ 'Styles','Format','Font','FontSize' ] },
                        { name: 'colors', items : [ 'TextColor','BGColor' ] },
                        { name: 'basicstyles', items : [ 'Bold','Italic' ] }
                    ]
                });
                _this.previewTitle = CKEDITOR.replace('previewTitle', {toolbar :
                    [
                        { name: 'document', items : [ 'Source' ] },
                        { name: 'links', items : [ 'Link','Unlink','Anchor' ] },
                        { name: 'styles', items : [ 'Styles','Format','Font','FontSize' ] },
                        { name: 'colors', items : [ 'TextColor','BGColor' ] },
                        { name: 'basicstyles', items : [ 'Bold','Italic' ] }
                    ]
                });
            }, 0)
        },

        addDatePickerDate: function(){
            this.ui.date.datepicker().datepicker();
        },

        lastTagFocus: function(e){
            var newTagView = this.tagTemplate();
            this.$el.find(".tags-container .controls").append( newTagView );
        },

        tagBlur: function(e){
            var tag = $(e.target);
            if($.trim(tag.val()) == "" ) tag.remove();
        },

        btnCancel: function(e){
            if(e) e.preventDefault();
            this.close();
        },

        getData: function(){

            var data = {
                title: this.title.getData(),
                date: this.ui.date.datepicker('getDate'),
                body: this.body.getData(),
                previewTitle: this.previewTitle.getData(),
                previewImg: this.ui.previewImg.val(),
                preset: this.ui.preset.val(),
                tags: this.getTags()
            };

            return data;

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

        valid: function(){
            var form = this.ui.form;
            return form.valid();
        },

        btnChangePost: function(e){
            if(e) e.preventDefault();

            if( this.valid() ){
                this.trigger("changePost", {
                    newData: this.getData(),
                    model: this.model
                });
                this.close();
            }else{
                console.log('WTF!');
            }
            return false;
        },

        chooseFile: function(e){
            e.preventDefault();
            this.trigger("chooseFile");
        },

        setPreviewUrl: function( url ){
            this.ui.previewImg.val(url);
        }
    })

})