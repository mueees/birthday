angular.module('templates.app', ['header.tpl.html', 'text/text.tpl.html', 'todo/todo.tpl.html']);

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

angular.module("text/text.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("text/text.tpl.html",
    "this's text");
}]);

angular.module("todo/todo.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("todo/todo.tpl.html",
    "<section id=\"todo\" ng-controller=\"TodoCtrl\">\n" +
    "    <header id=\"header\">\n" +
    "        <h1>Todo application</h1>\n" +
    "        <form id=\"todo-form\" ng-submit=\"addTodo()\">\n" +
    "            <input id=\"new-todo\" placeholder=\"What needs to be done?\" ng-model=\"newTodo\" autofocus>\n" +
    "        </form>\n" +
    "\n" +
    "    </header>\n" +
    "    <section id=\"main\" ng-show=\"todos.length\" ng-cloak>\n" +
    "        <input id=\"toggle-all\" type=\"checkbox\" ng-model=\"allChecked\" ng-click=\"markAll(!allChecked)\">\n" +
    "        <label for=\"toggle-all\">Mark all as complete</label>\n" +
    "        <ul id=\"todo-list\">\n" +
    "            <li ng-repeat=\"todo in todos track by $index\">\n" +
    "                <div class=\"view\">\n" +
    "                    <input class=\"toggle\" type=\"checkbox\" ng-model=\"todo.completed\">\n" +
    "                    <label ng-dblclick=\"editTodo(todo)\">{{todo.title}}</label>\n" +
    "                    <button class=\"destroy\" ng-click=\"removeTodo(todo)\">remove</button>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </section>\n" +
    "    <footer id=\"footer\" ng-show=\"todos.length\" ng-cloak>\n" +
    "        <span id=\"todo-count\">\n" +
    "            <strong>{{remainingCount}}</strong>\n" +
    "            <ng-pluralize count=\"remainingCount\" when=\"{ one: 'item left', other: 'items left' }\"></ng-pluralize>\n" +
    "        </span>\n" +
    "        <ul id=\"filters\">\n" +
    "            <li>\n" +
    "                <a ng-class=\"{selected: location.path() == '/angular/todo'} \" href=\"/angular/todo\">All</a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <a ng-class=\"{selected: location.path() == '/angular/todo/active'}\" href=\"/angular/todo/active\">Active</a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <a ng-class=\"{selected: location.path() == '/angular/todo/completed'}\" href=\"/angular/todo/completed\">Completed</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        <button id=\"clear-completed\" ng-click=\"clearCompletedTodos()\" ng-show=\"completedCount\">Clear completed ({{completedCount}})</button>\n" +
    "    </footer>\n" +
    "</section>");
}]);
