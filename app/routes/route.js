var rootController = require('../controllers/rootcontroller');
var apiController = require('../controllers/api');


module.exports = function(app) {

    //Root Paths
    app.get('/', rootController.home);

    //user
    app.post('/api/user', apiController.user.add);
    app.delete('/api/user/:id', apiController.user.deleteUser);
    app.put('/api/user/:id', apiController.user.changeUser);
    app.get('/api/users', apiController.user.users);
    app.get('/api/users/count', apiController.user.count);

    //event
    app.post("/api/event", apiController.event.add);
    app.put('/api/event/:id', apiController.event.changeEvent);
    app.post("/api/event/getEventToShow", apiController.event.getEventsToShow);
    app.delete('/api/event/:id', apiController.event.deleteEvent);


    app.get("/api/event/:id", apiController.event.get);
    app.get('/api/user/get', apiController.user.get);

    //task
    app.post("/api/task", apiController.task.add);
    app.put("/api/task/:id", apiController.task.changeTask);
    app.delete('/api/task/:id', apiController.task.deleteTask);
    app.get("/api/taskLists", apiController.task.getTaskLists);
    app.post("/api/taskList", apiController.task.addTaskList);
    app.delete('/api/taskList/:id', apiController.task.deleteTaskList);
    app.get("/api/getTasks", apiController.task.getTasks);

    //blog
    app.post("/api/post", apiController.blog.addPost);
    app.put("/api/post/:id", apiController.blog.changePost);
    app.delete("/api/post/:id", apiController.blog.deletePost);
    app.get("/api/getPosts", apiController.blog.getPosts);

    //preset
    app.post("/api/preset", apiController.preset.addPreset);
    app.post("/api/getPresets", apiController.preset.getPresets);
    app.put("/api/preset/:id", apiController.preset.changePreset);
};