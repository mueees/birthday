CKEDITOR.dialog.add( 'slider', function( editor ) {
    return {
        title: 'Edit Simple Box',
        minWidth: 200,
        minHeight: 100,

        contents: [
            {
                id: 'tab-basic',
                elements: [
                    {
                        type: 'button',
                        hidden: true,
                        id: 'id0',
                        label: editor.lang.common.browseServer,
                        filebrowser: {
                            action: 'Browse',
                            onSelect: function( files, data ) {
                                var dialog = this.getDialog();
                                dialog.userFiles = files;
                                dialog.userData = data;

                                return false;
                            }
                        },
                        commit: function( widget ) {
                        	debugger
				            widget.setData( 'slider', "this is slider data" );
				        }
                    }
                ]
            }
        ]
    };

});