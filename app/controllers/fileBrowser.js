var fs = require('fs'),
    url = require('url'),
    jQuery = require( "jquery"),
    async = require('async'),
    _ = require('underscore'),
    ncp = require('ncp').ncp,
    fsExtra = require('fs-extra'),
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

    newFolder: function(request, response, next){
        var parts = url.parse( request.url, true );

        if( !parts.query.dirPath ){
            response.statusCode = 400;
            response.send("dirPath is required");
            return false;
        }

        var fsWorker = new FsWorker();
        fsWorker.makeDir(parts.query.dirPath, null, function(err){
            if(err) return next(err);
            response.end();
        });
    },

    upload: function(request, response, next){
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
                if(err) return next(err);

                var newPath = pathToSave + file.name;
                fs.writeFile(newPath, data, function (err) {
                    if(err) return next(err);
                });
            });

        })

        response.end();

    },

    downloadItems: function( request, response, next ){

        var fsWorker = new FsWorker();
        var paths = request.body.paths,
            realPath = [],
            root = "./public";

        if( !paths ){
            next(new Error("Nothing to download"));
            return false;
        }

        _.each(paths, function(path){
            realPath.push(root + path);
        })

        //проверить существуют ли файлы
        async.waterfall([
            function(callback){
                fsWorker.existsList(realPath, function(err, results){
                    if(err) next(err);
                    callback(null, results);
                });
            },
            function(results, callback){
                _.each(results, function(result, i){
                    if(!result){
                        realPath.splice(i, 1);
                    }
                })
                if( !realPath.length ) {
                    callback(new Error("Nothing to download"));
                }else{
                    callback(null, realPath);
                }

            },
            function(realPath, callback){


                _.each(realPath, function(path, i){
                    /*ncp(path, './tmp/', function (err) {
                        if (err) {
                            return console.error(err);
                        }
                        console.log('done!');
                    });*/

                    fsExtra.copy(path, './tmp', function(err){
                        if (err) {
                            console.error(err);
                        }
                        else {
                            console.log("success!")
                        }
                    });
                })

                //если существуют, сделать архив
                /*var soursePath = realPath.join(" ");
                var archiveName = "/tmp/" + new Date().getTime() + ".zip";
                var zipPath = root + archiveName;
                var execFile = require('child_process').exec;

                execFile("zip -r " + zipPath + " " + soursePath,function(err, stdout) {
                    if(err) callback(err);
                    callback(null, stdout);
                });*/
            },
            function(stdout, callback){
                console.log(stdout);
            }
        ], function (err, realPath) {
            if(err) next(err);
        });




        //положить его в public/tmp


        /*var root = "./public";
        var soursePath = "./public" + request.body.paths[0];
        var archiveName = "/tmp/" + new Date().getTime() + ".zip";
        var zipPath = root + archiveName;


        var execFile = require('child_process').execFile;

        execFile('zip', ['-r', zipPath, soursePath], function(err, stdout) {
            if(err) {
                console.log(err);
                return false;
            }
        });*/

        response.end();

    }
}

module.exports = controller;