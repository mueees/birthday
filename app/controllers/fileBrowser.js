var fs = require('fs'),
    url = require('url'),
    jQuery = require( "jquery"),
    async = require('async'),
    _ = require('underscore'),
    ncp = require('ncp').ncp,
    path = require('path'),
    Utility = require('libs/utility'),
    config = require('config'),
    HttpError = require('error').HttpError,
    FsWorker = require("fsWorker");

var root = config.get("publicDir");


var controller = {
    getData: function(request, response, next){
        var parts,
            pathDir,
            pathDirRoot,
            fsWorker;

        parts = url.parse( request.url, true );
        if( !parts.query.path ) return next(new HttpError(400, "Path is required"));

        pathDir = Utility.normalize( parts.query.path );
        pathDirRoot = Utility.addRootToPath(pathDir);
        fsWorker = new FsWorker();

        async.waterfall([
            function(callback){
                //check exist pathDir
                fs.exists(pathDirRoot, function(exists){
                    callback(null, exists);
                });
            },
            function(exists, callback){
                //get folder content

                if( !exists ){
                    callback( new HttpError(400, "Path is not found") );
                }

                fsWorker.listDirWithInfo(pathDirRoot, function(err, list){
                    if(err) return callback(err);
                    callback(null, list);
                });
            }
        ],
            function(err, list){
                if(err) return next(err);
                response.send(list);
            }
        )

    },

    deleteItems: function(request, response, next){

        var fsWorker,
            body,
            paths;

        body = request.body;
        if(!body.paths) return next(new HttpError(400, "Path is required"));

        paths = Utility.normalizeArray(body.paths);
        paths = Utility.addRootToPath(paths);

        fsWorker = new FsWorker();

        fsWorker.removeDirs(paths, function(err){
            if(err) next(err);
            response.end();
        });
    },

    newFolder: function(request, response, next){
        var parts = url.parse( request.url, true );
        var root = "./public"

        if( !parts.query.dirPath ){
            response.statusCode = 400;
            response.send("dirPath is required");
            return false;
        }

        var fsWorker = new FsWorker();
        fsWorker.makeDir( root + "/" + parts.query.dirPath, null, function(err){
            if(err) return next(err);
            response.end();
        });
    },

    upload: function(request, response, next){
        var pathToSave, files;


        if( request.body.path ){
            pathToSave = root + request.body.path;
        }else{
            return next( new HttpError(400, "Path required") );
        }

        files = request.files.uploadFile;

        while(files[0].name === undefined){
            files = files[0];
        }

        async.waterfall([
            //check path
            function (callback){
                fs.exists(pathToSave, function(exists){
                    if(exists){
                        callback(null, true);
                    }else{
                        callback(null, false);
                    }
                });
            },

            //save files
            function(exists, callback){
                if(!exists) callback( new Error("Path is not found") );

                var max = files.length;
                var iterator = 0,
                    i;

                var methods = [];
                for ( i = 0; i < max; i++) {
                    (function(file){
                        methods.push(function(callback) {

                            fs.readFile(file.path, function (err, data) {
                                if(err) return next(err);

                                var newPath = pathToSave + file.name;
                                fs.writeFile(newPath, data, function (err) {
                                    if(err) return next(err);
                                    callback(null);
                                });
                            });

                        });
                    })(files[i]);
                }

                async.parallel(methods, function(err) {
                    if(err) {
                        callback(err);
                        return;
                    }

                    callback(err);
                })

            }
        ], function(err){
            if(err) next(err);
            response.end();
        })

    },

    downloadItems: function(request, response, next){
        var fsWorker = new FsWorker();
        var paths = request.body.paths,
            realPath = [],
            flName = new Date().getTime(),
            zipPathToSend = "/tmp/" + flName + ".zip",
            zipDestination = root + zipPathToSend;

        if( !paths ){
            next(new Error("Nothing to download"));
            return false;
        }

        //merge root and path
        _.each(paths, function(currentPath){
            realPath.push(root + currentPath);
        })

        //проверить существуют ли файлы
        async.waterfall([
            function(callback){
                fsWorker.existsList(realPath, function(err, results){
                    if(err) return next(err);
                    callback(null, results);
                });
            },
            function(results, callback){
                if( !results ) {
                    callback(new Error("Nothing to download"));
                }else{
                    callback(null, realPath);
                }

            },
            function(realPath, callback){
                //make archive

                var execFile = require('child_process').exec;

                execFile("zip -r " + zipDestination + " " + realPath.join(" "),
                    {maxBuffer: 2000000000*1024 },
                    function(err, stdout) {
                        if(err) return callback(err);
                        callback(null);
                    });
            }
        ], function (err) {
            if(err) return next(err);
            response.send({
                redirect: zipPathToSend
            });

        });
    }
}

module.exports = controller;