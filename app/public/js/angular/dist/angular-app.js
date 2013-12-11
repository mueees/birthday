angular.module('app', [
  'ngRoute',
  'templates.app',
  'templates.common',
  'todo'
  ]);

angular.module('app').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	//$routeProvider.otherwise({redirectTo:'/angular/todo'});  
}]);

angular.module('app').controller('AppCtrl', ['$scope', function($scope) {}]);
angular.module('app').controller('HeaderCtrl', ['$scope', function($scope) {}]);
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
angular.module('templates.app', ['header.tpl.html', 'todo/todo.tpl.html']);

angular.module("header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("header.tpl.html",
    "<div class=\"navbar\" ng-controller=\"HeaderCtrl\">\n" +
    "    <ul>\n" +
    "        <li>\n" +
    "            <a href=\"/angular/todo\">Todo application</a>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <a href=\"/angular/text\">Text application</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "    <!-- <div class=\"navbar-inner\">\n" +
    "        <a class=\"brand\" ng-click=\"home()\">AScrum</a>\n" +
    "        <ul class=\"nav\">\n" +
    "            <li ng-class=\"{active:isNavbarActive('projectsinfo')}\"><a href=\"/projectsinfo\">Current Projects</a></li>\n" +
    "        </ul>\n" +
    "    \n" +
    "        <ul class=\"nav\" ng-show=\"isAuthenticated()\">\n" +
    "            <li ng-class=\"{active:isNavbarActive('projects')}\"><a href=\"/projects\">My Projects</a></li>\n" +
    "            <li class=\"dropdown\" ng-class=\"{active:isNavbarActive('admin'), open:isAdminOpen}\" ng-show=\"isAdmin()\">\n" +
    "                <a id=\"adminmenu\" role=\"button\" class=\"dropdown-toggle\" ng-click=\"isAdminOpen=!isAdminOpen\">Admin<b class=\"caret\"></b></a>\n" +
    "                <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"adminmenu\">\n" +
    "                    <li><a tabindex=\"-1\" href=\"/admin/projects\" ng-click=\"isAdminOpen=false\">Manage Projects</a></li>\n" +
    "                    <li><a tabindex=\"-1\" href=\"/admin/users\" ng-click=\"isAdminOpen=false\">Manage Users</a></li>\n" +
    "                </ul>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        <ul class=\"nav pull-right\" ng-show=\"hasPendingRequests()\">\n" +
    "            <li class=\"divider-vertical\"></li>\n" +
    "            <li><a href=\"#\"><img src=\"/static/img/spinner.gif\"></a></li>\n" +
    "        </ul>\n" +
    "        <login-toolbar></login-toolbar>\n" +
    "    </div>\n" +
    "    <div>\n" +
    "        <ul class=\"breadcrumb\">\n" +
    "            <li ng-repeat=\"breadcrumb in breadcrumbs.getAll()\">\n" +
    "                <span class=\"divider\">/</span>\n" +
    "                <ng-switch on=\"$last\">\n" +
    "                    <span ng-switch-when=\"true\">{{breadcrumb.name}}</span>\n" +
    "                    <span ng-switch-default><a href=\"{{breadcrumb.path}}\">{{breadcrumb.name}}</a></span>\n" +
    "                </ng-switch>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div> -->\n" +
    "</div>");
}]);

angular.module("todo/todo.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("todo/todo.tpl.html",
    "<section id=\"todo\" ng-controller=\"TodoCtrl\">\n" +
    "	<header id=\"header\">\n" +
    "		<h1>Todo application</h1>\n" +
    "		<form id=\"todo-form\" ng-submit=\"addTodo()\">\n" +
    "			<input id=\"new-todo\" placeholder=\"What needs to be done?\" ng-model=\"newTodo\" autofocus>\n" +
    "		</form>\n" +
    "		\n" +
    "	</header> \n" +
    "	<section id=\"main\" ng-show=\"todos.length\" ng-cloak>\n" +
    "\n" +
    "		<input id=\"toggle-all\" type=\"checkbox\" ng-model=\"allChecked\" ng-click=\"markAll(!allChecked)\">\n" +
    "		<label for=\"toggle-all\">Mark all as complete</label>\n" +
    "		<ul id=\"todo-list\">\n" +
    "					<li ng-repeat=\"todo in todos track by $index\">\n" +
    "						<div class=\"view\">\n" +
    "							<input class=\"toggle\" type=\"checkbox\" ng-model=\"todo.completed\">\n" +
    "							<label ng-dblclick=\"editTodo(todo)\">{{todo.title}}</label>\n" +
    "							<button class=\"destroy\" ng-click=\"removeTodo(todo)\">remove</button>\n" +
    "						</div>\n" +
    "					</li>\n" +
    "				</ul>\n" +
    "	</section>\n" +
    "\n" +
    "</section>");
}]);

angular.module('templates.common', []);

