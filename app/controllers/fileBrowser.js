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
        pathDir = Utility.normalize( parts.query.path );
        if( !pathDir ) return next(new HttpError(400, "Path is required"));

        pathDirRoot = root + pathDir;
        fsWorker = new FsWorker();

        async.waterfall([
            function(callback){
                //check exist pathDir
                fsWorker.exists(pathDirRoot, function(err, exists){
                    if(err) callback(err);
                    callback(err, exists);
                });
            },
            function(exists, callback){
                //get folder content

                if( !exists ){
                    callback( new HttpError(400, "Path is not found") );
                }

                fsWorker.listDirWithInfo(pathDirRoot, function(err, list){
                    if(err) callback(err);
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
        var body = request.body;
        if(!body.paths){
            if( !body.paths ) return next(new HttpError(400, "Path is required"));
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

    downloadItems: function(request, response){
        var fsWorker = new FsWorker();
        var paths = request.body.paths,
            realPath = [],
            flName = new Date().getTime(),
            flDestination = "./tmp/" + flName,
            zipDestination = "./tmp/" + flName + ".zip",
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
                //make zip dir

                fsWorker.makeDir(flDestination, null,  function(err){
                    if(err) return callback(err);
                    callback(null, realPath);
                })

            },
            function(realPath, callback){
                //copy file to dir


                _.each(realPath, function(path, i){

                    var pathArray = path.split(pathModule.sep);

                    _.each(pathArray, function(path, i){
                        if(!path){
                            pathArray.splice(i, 1);
                        }
                    })


                    async.parallel([
                        function(callback){
                            setTimeout(function(){
                                callback(null, 'one');
                            }, 200);
                        },
                        function(callback){
                            setTimeout(function(){
                                callback(null, 'two');
                            }, 100);
                        }
                    ],
                        function(err, results){
                            // the results array will equal ['one','two'] even though
                            // the second function had a shorter timeout.
                        });

                    ncp(path, flDestination + "/" + pathArray[pathArray.length-1], function (err) {
                        if (err) {
                            return callback(err);
                        }
                    });

                })


            },
            function(){
                //если существуют, сделать архив
                var execFile = require('child_process').exec;

                execFile("zip -r " + zipDestination + " " + flDestination, function(err, stdout) {
                    if(err) callback(err);
                    callback(null, stdout);
                });
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