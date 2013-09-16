define([
    'marionette',
    'text!app/templates/blog/addPost/addPost.html',
    'datepicker',
    'validate',
    'ckeditor'
], function(Marionette, template){

    return Marionette.ItemView.extend({
        template: _.template(template),

        events: {
            "click .btnAddPost": "addPost",
            "focus .tags:last": "lastTagFocus",
            "blur .tags": "tagBlur",
            "change #preset": "presetChange"
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

        initialize: function( options ){
            this.parent = options.parent;
            this.listenTo(this.parent, "addNewPreset:internal", this.addNewPresetToCollection);
            this.listenTo(this.parent, "getPresetsCollection:internal", this.setPresetColection);
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

        addDatePickerDate: function(){
            this.ui.date.datepicker().datepicker("setValue", new Date());
        },

        addCkeEditor: function(){
            var _this = this;
            setTimeout(function(){
                _this.body = CKEDITOR.replace('body', {
                    filebrowserBrowseUrl : '/',
                    filebrowserUploadUrl : '/'
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

        lastTagFocus: function(e){
            var newTagView = this.tagTemplate();
            this.$el.find(".tags-container .controls").append( newTagView );
        },

        tagBlur: function(e){
            var tag = $(e.target);
            if($.trim(tag.val()) == "" ) tag.remove();
        },

        presetChange: function(e){
            var _id = this.ui.preset.val();
            var model = this.presetCollection.get(_id);
            this.trigger("changePreset", {model: model});
        },

        addNewPresetToCollection: function(data){
            this.presetCollection.add(data.model);
        },

        setPresetColection: function( presetCollection ){
            this.presetCollection = presetCollection;
            this.renderPresetCollection();
            this.listenTo(presetCollection, "add", this.renderNewPreset);
        },

        renderPresetCollection: function(){
            var _this = this;
            this.ui.preset.html("");
            this.presetCollection.each(function(preset, i){
                var data = preset.toJSON();
                _this.ui.preset.append('<option value="'+data['_id']+'">'+data['name']+'</option>');
            })
        },

        renderNewPreset: function(preset){
            var data = preset.toJSON();

            this.ui.preset.append('<option value="'+data['_id']+'">'+data['name']+'</option>');
        },

        getData: function(){

            var data = {
                title: this.title.getData(),
                date: this.ui.date.val(),
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

        addPost: function(e){
            if(e) e.preventDefault();

            if( this.valid() ){
                this.trigger("addNewPost", this.getData());

            }else{
                console.log('WTF!');
            }
            return false;
        }
    })

})