var fs = require('fs'),
    url = require('url'),
    jQuery = require( "jquery"),
    fs = require('fs'),
    _ = require('underscore'),
    FsWorker = require("fsWorker");

var controller = {
    getData: function(request, response, next){
        var parts = url.parse( request.url, true );

        if( !parts.query.path ){
            response.statusCode = 400;
            response.send("Path is required");
            return false;
        }

        var fsWorker = new FsWorker();
        fsWorker.listDirWithInfo(parts.query.path, function(err, list){
            if(err) return next(err);
            response.send(list);
        });

    },

    deleteItems: function(request, response){
        var body = request.body;
        if(!body.paths){
            response.status = 400;
            response.send("paths is required");
            return false;
        }

        var fsWorker = new FsWorker();
        try{
            fsWorker.removeDirs(body.paths);
            response.send();
        }catch(e){
            response.status = 400;
            response.send("Server problem.");
            return false;
        }


    },

    newFolder: function(request, response){
        var parts = url.parse( request.url, true );

        if( !parts.query.dirPath ){
            response.statusCode = 400;
            response.send("dirPath is required");
            return false;
        }

        var fsWorker = new FsWorker();
        fsWorker.makeDir(parts.query.dirPath, null, function(err){

            if(err){
                response.status = 400;
                response.send(err);
                return false;
            }

            response.end();
        });
    },

    upload: function(request, response){
        var pathToSave, files;

        if( request.body.path ){
            pathToSave = "./public" + request.body.path;
        }else{
            pathToSave = "./public/tmp/";
        }

        files = request.files.uploadFile;

        while(files[0].name === undefined){
            files = files[0];
        }


        files.forEach(function(file){

            fs.readFile(file.path, function (err, data) {
                if(err) {
                    console.log(err);
                    return false;
                }

                var newPath = pathToSave + file.name;
                fs.writeFile(newPath, data, function (err) {
                    console.log(err);
                });
            });

        })

        response.end();

    }
}

module.exports = controller;