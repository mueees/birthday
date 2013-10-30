CKEDITOR.dialog.add( 'FileManagerDialog', function( editor ) {
    return {
        text: "f",
        title: 'FileManagerDialog',
        minWidth: 400,
        minHeight: 200,
        contents: [
            {
                id: 'tab-basic',
                label: 'Basic Settings',
                elements: [
                    {
                        type: 'text',
                        id: 'width',
                        label: 'Width'
                    },
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

                                var i,
                                    max = dialog.userFiles.length,
                                    image = [];

                                for( i = 0; i < max; i++ ){
                                    image.push( '<img width=50 src="'+ dialog.userFiles[i] +'" /> </br >' )
                                }
                                
                                // "this" is now a CKEDITOR.dialog object.
                                var document = dialog.getElement().getDocument();
                                // document = CKEDITOR.dom.document
                                var imagesContainer = document.getById( 'imagesContainer' );
                                imagesContainer.setHtml("");
                                imagesContainer.setHtml(image.join(''));

                                return false;
                            }
                        }
                    },
                   {
                       type: 'html',
                       id: 'photoContainer',
                       html: '<div style="max-height: 500px; overflow:scroll;" id="imagesContainer"></div>'
                   }
                ]
            }
        ],
        onOk: function() {
            var dialog = this;
            var images = [];
            var br;
            var width = dialog.getValueOf( 'tab-basic', 'width' ) || 300;
            

            if( !dialog.userFiles || !dialog.userFiles.length ) return false;

            var i,
                max = dialog.userFiles.length,
                image;

            for( i = 0; i < max; i++ ){
                image = editor.document.createElement( 'img' );
                br = editor.document.createElement( 'br' );
                image.setAttribute( 'src', dialog.userFiles[i] );
                image.setAttribute( 'width', width );
                editor.insertElement( image );
                editor.insertElement( br );
            }

        }
    };
});