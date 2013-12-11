var rootController = require('../controllers/rootcontroller');
var apiController = require('../controllers/api');
var fileBrowserController = require('../controllers/fileBrowser');
var twitterController = require('../controllers/twitter');
var checkoAuth = require('middleware/checkAuth');
var HttpError = require('error').HttpError;
var config = require("config");

var middleware = [checkoAuth];

module.exports = function(app) {

    //Root Paths
    app.get('/', rootController.home);
    app.get('/angular', rootController.angular);
    app.get('/angular/todo', rootController.angular);
    app.get('/fileBrowser', rootController.fileBrowser);

    //user
    app.post('/api/user', middleware, apiController.user.add);
    app.delete('/api/user/:id', middleware, apiController.user.deleteUser);
    app.put('/api/user/:id', middleware, apiController.user.changeUser);
    app.get('/api/users', middleware, apiController.user.users);
    app.get('/api/users/count', middleware, apiController.user.count);

    //event
    app.post("/api/event", middleware, apiController.event.add);
    app.put('/api/event/:id', middleware,  apiController.event.changeEvent);
    app.post("/api/event/getEventToShow", middleware, apiController.event.getEventsToShow);
    app.delete('/api/event/:id', middleware, apiController.event.deleteEvent);


    app.get("/api/event/:id", middleware, apiController.event.get);
    app.get('/api/user/get', middleware, apiController.user.get);

    //task
    app.post("/api/task", middleware, apiController.task.add);
    app.put("/api/task/:id", middleware, apiController.task.changeTask);
    app.delete('/api/task/:id', middleware, apiController.task.deleteTask);
    app.get("/api/taskLists", middleware, apiController.task.getTaskLists);
    app.post("/api/taskList", middleware, apiController.task.addTaskList);
    app.delete('/api/taskList/:id', middleware, apiController.task.deleteTaskList);
    app.get("/api/getTasks", middleware, apiController.task.getTasks);

    //blog
    app.post("/api/post", middleware, apiController.blog.addPost);
    app.put("/api/post/:id", middleware, apiController.blog.changePost);
    app.delete("/api/post/:id", middleware,  apiController.blog.deletePost);
    app.get("/api/getPosts", apiController.blog.getPosts);

    //preset
    app.post("/api/preset", middleware,  apiController.preset.addPreset);
    app.post("/api/getPresets", apiController.preset.getPresets);
    app.put("/api/preset/:id", middleware, apiController.preset.changePreset);

    //fileBrowser
    app.get("/api/fileBrowser", middleware, fileBrowserController.getData);
    app.get("/api/fileBrowser/newFolder", middleware, fileBrowserController.newFolder);
    app.delete("/api/fileBrowser/deleteItems", middleware, fileBrowserController.deleteItems);
    app.post("/upload", middleware, fileBrowserController.upload);
    app.post("/api/fileBrowser/downloadItems", middleware, fileBrowserController.downloadItems);

    //twitter
    app.post("/api/twitter/stream", middleware, twitterController.saveNewStream);
    app.post("/api/twitter/getStreams", middleware, twitterController.getStreams);

    //login
    app.post("/api/login", function( req, res, next ){
        if( req.body.password != config.get("password") ){
            next(new HttpError(401, {
                error: "Wrong password"
            }));
        }else{
            req.session.isHaveAccess = true;
            res.end();
        }
    })

    //logout
    app.post("/api/logout", function( req, res, next ){
        req.session.destroy();
        res.end();
    })
};