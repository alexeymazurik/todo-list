
var searchServices = angular.module('SearchServices', ['ngResource']);

searchServices.factory('dataServices', ['$http', '$location',
    function($http, $location){

        return {

            findProjects: function(user_id, done) {

                $http({
                    url: '/results',
                    method: 'POST',
                    data: {
                        user_id: user_id
                    }
                }).
                success(function(data){
                    done(data);
                }).
                error(function(data){
                    $location.path('/login');
                });

            },

            addProject: function(projectName, userId, done) {

                $http({
                    url: '/addProject',
                    method: 'POST',
                    data: {
                        project_name: projectName,
                        user_id: userId
                    }
                }).
                    success(function(data){
                        console.log("SUCCESS!!!");
                        done(data);
                    }).
                    error(function(){
                        console.log("ERROR!!!");
                        done(false);
                    });
            },

            deleteTask: function(task_id, done) {
                $http({
                    url: 'deleteTask',
                    method:'POST',
                    data: {
                        task_id: task_id
                    }
                }).
                success(function(){
                    done(true);
                }).
                error(function(){
                    done(false);
                });
            },

            editProject: function(project_id, project_name, done) {

                $http({
                    url: '/editProject',
                    method: 'POST',
                    data: {
                        project_id: project_id,
                        project_name: project_name
                    }
                }).
                success(function(){
                    done(true);
                }).
                error(function(){
                    done(false);
                });

            },

            deleteProject: function(projectId, done) {
                console.log('YEAH!');
                $http({
                    url: '/deleteProject',
                    method: 'POST',
                    data: {
                        project_id: projectId
                    }
                }).
                success(function(){
                        console.log('YEEEAH!');
                        done(true);
                    }).
                error(function(){
                        console.log('ERROR!!!!!!');
                        done(false);
                    });
            },

            addTask: function(project_id, task_name, task_deadline, done) {

                $http({
                    url: '/addTask',
                    method: 'POST',
                    data: {
                        project_id : project_id,
                        task_name: task_name,
                        task_deadline: task_deadline
                    }
                }).
                success(function(data){
                        done(data);
                    }).
                error(function(data){
                        done(data);
                    });

            },



            editTask: function(task_id, task_name, task_deadline, done) {
                $http({
                    url: '/editTask',
                    method: 'POST',
                    data: {
                        task_id: task_id,
                        task_name: task_name,
                        task_deadline: task_deadline
                    }
                }).
                success(function(){
                        console.log('OK');
                        done(true);
                }).
                error(function(){
                        console.log('Error!');
                        done(false);
                });
            },

            editStatus: function(task_id, task_status, done) {
                var tmp = 0;
                if (task_status) {
                    tmp = 1;
                }

                $http({
                    url: '/editStatus',
                    method: 'POST',
                    data: {
                        task_id: task_id,
                        task_status: tmp
                    }
                }).
                success(function(){
                    done(true);
                }).
                error(function(){
                    done(false);
                });
            }

        }


    }
]);

searchServices.factory('userServices', ['$http', '$location', function($http, $location){

    return {

        signIn: function(username, password, done) {

            $http({
                url: '/signin',
                method: 'POST',
                data: {
                    username: username,
                    password: password
                }
            }).
            success(function(){
                // data is user here
                $location.path('/main');
            }).
            error(function(){
                done(true);
            });

        },

        signUp: function(username, password, done) {
            $http({
                url: '/signup',
                method: 'POST',
                data: {
                    username: username,
                    password: password
                }
            }).
            success(function(data){
                console.log(data);
                if(data) {
                    $location.path('/main');
                }
            }).
            error(function(data){
                done(true);
            });
        }

    }

}]);

