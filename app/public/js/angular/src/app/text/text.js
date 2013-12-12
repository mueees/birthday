angular.module('text', [], ['$routeProvider', function($routeProvider){
    $routeProvider.when('/angular/text', {
        templateUrl: 'text/text.tpl.html',
        controller: 'TextCtrl'
    })
}]);

angular.module('text').controller('TextCtrl', ['$scope', function($scope){

}])