var rootController = require('../controllers/rootcontroller');
var apiController = require('../controllers/api');


module.exports = function(app) {

  //Root Paths
  app.get('/', rootController.home);

  //api
  app.post('/api/user/add', apiController.user.add);
  app.post('/api/user/deleteUser', apiController.user.deleteUser);
  app.get('/api/user/get', apiController.user.get);
  app.get('/api/users', apiController.user.users);

};