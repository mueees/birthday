angular.module('todo', [], ['$routeProvider', function($routeProvider){

  $routeProvider.when('/angular/todo', {
    templateUrl:'todo/todo.tpl.html',
    controller:'TodoCtrl'
  });

}]);

angular.module('todo').factory('todoStorage', function(){
	var STORAGE_ID = 'todos-angularjs';

	return {
		get: function(){
			return JSON.parse( localStorage.getItem(STORAGE_ID) || '[]' );
		},

		set: function(todos){
			localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
		}
	};
});

angular.module('todo').controller('TodoCtrl', ['$scope', 'todoStorage', function($scope, todoStorage){
	var todos = $scope.todos = todoStorage.get();

	$scope.newTodo = '';
	$scope.editedTodo = null;
	$scope.allChecked = false;

	$scope.addTodo = function(){
		var newTodo = $scope.newTodo.trim();
		if (!newTodo.length) {
			return;
		}

		todos.push({
			title: newTodo,
			completed: false
		});

		$scope.newTodo = '';
	};

	$scope.$watch('todos', function (newValue, oldValue) {
		//$scope.remainingCount = filterFilter(todos, { completed: false }).length;
		//$scope.completedCount = todos.length - $scope.remainingCount;
		//$scope.allChecked = !$scope.remainingCount;
		if (newValue !== oldValue) { // This prevents unneeded calls to the local storage
			todoStorage.set(todos);
		}
	}, true);

	$scope.removeTodo = function(todo){
		todos.splice(todos.indexOf(todo), 1);
	};

	$scope.markAll = function(completed){
		console.log(completed);
		todos.forEach(function (todo) {
			todo.completed = completed;
		});
	};

}]); 