var rootController = require('../controllers/rootcontroller');
var apiController = require('../controllers/api');


module.exports = function(app) {

    //Root Paths
    app.get('/', rootController.home);

    //api

    //user
    app.post('/api/user', apiController.user.add);
    app.delete('/api/user/:id', apiController.user.deleteUser);
    app.get('/api/user/get', apiController.user.get);
    app.get('/api/users', apiController.user.users);
    app.get('/api/users/count', apiController.user.count);

};