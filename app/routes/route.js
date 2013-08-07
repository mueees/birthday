var rootController = require('../controllers/rootcontroller');
var apiController = require('../controllers/api');


module.exports = function(app) {

  //Root Paths
  app.get('/', rootController.home);

  //api
  app.get('/api/user/add', apiController.user.add);

};