CKEDITOR.plugins.add('Slider', {
    requires: 'widget',

    icons: 'slider',

    init: function( editor ) {

        CKEDITOR.dialog.add( 'slider', this.path + 'dialogs/slider.js' );

        editor.widgets.add( 'slider', {
            button: 'Create a simple slider',

            dialog: 'slider',

         template:
            '<div class="slider"></div>',

            editables: {
                slider: {
                    selector: '.slider'
                }
            }
        });
    }
});