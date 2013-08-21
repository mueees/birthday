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


    app.get("/api/event/:id", apiController.event.get);

    app.get('/api/user/get', apiController.user.get);


};