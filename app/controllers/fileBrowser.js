var fs = require('fs'),
    url = require('url'),
    queryString = require( "querystring"),
    jQuery = require( "jquery"),
    fs = require('fs');
    _ = require('underscore');

var controller = {
    getData: function(request, response){
        var parts = url.parse( request.url, true );

        if( !parts.query.path ){
            response.statusCode = 400;
            response.send("Path is required");
            return false;
        }

        controller.scanPath(parts.query.path, response);
    },

    scanPath: function(path, response){

        fs.readdir("./public" + path, function(err, files){
            for(var i = 0; i < files.length; i++){
                var file = "./public" + path + '/' + files[i];

                fs.stat(file, function(err, stat) {
                    console.log(stat);
                    console.log(stat.isDirectory());
                });
            }
        });
    }
}

module.exports = controller;