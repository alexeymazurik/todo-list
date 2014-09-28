
var toDoApp = angular.module('toDoApp', [
    'toDoControllers',
    'ngRoute',
    'ui.bootstrap',
    'SearchServices'
]);

moment().format();

//
toDoApp.config(['$routeProvider', function($routeProvider){
    $routeProvider.
        when('/login', {
            templateUrl: '/views/partials/login.html'
        }).
        when('/main', {
            templateUrl: '/views/partials/main.html'
        }).
        when('/registration', {
            templateUrl: '/views/partials/registration.html'
        }).
        otherwise({
            redirectTo: '/login'
        });

}]);