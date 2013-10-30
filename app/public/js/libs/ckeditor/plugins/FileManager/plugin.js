CKEDITOR.plugins.add( 'FileManager', {
    icons: 'FileManager',
    init: function( editor ) {
    	
        editor.addCommand( 'FileManagerDialog', new CKEDITOR.dialogCommand( 'FileManagerDialog' ) );

        editor.ui.addButton( 'FileManager', {
		    label: 'FileManager',
		    command: 'FileManagerDialog',
		    toolbar: 'insert'
		});

        CKEDITOR.dialog.add( 'FileManagerDialog', this.path + 'dialogs/FileManager.js' );
    }
});