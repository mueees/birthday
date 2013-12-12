angular.module('app', [
    'ngRoute',
    'templates.app',
    'templates.common',
    'todo',
    'text'
]);

angular.module('app').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
}]);

angular.module('app').controller('AppCtrl', ['$scope', function($scope) {}]);
angular.module('app').controller('HeaderCtrl', ['$scope', function($scope) {}]);