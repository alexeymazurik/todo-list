var toDoControllers = angular.module('toDoControllers', []);

toDoControllers.controller('mainCtrl', ['$scope', 'dataServices', '$http', '$location', function($scope, dataServices, $http, $location){

    //Initialization



    $scope.user_name = '';
    $scope.results = [];
    $scope.isCollapsed = true;
    $scope.projectToAdd = '';
    $scope.projectToEdit = -1;
    $scope.projectEditable = false;


    dataServices.findProjects(1, function(data){
        $scope.results = data;
        for (var i = 0; i < $scope.results.length; i++) {
            resetParams(i);
        }
        sortData();
    });

    $http({
        url: '/getuser',
        method:'GET'
    }).
    success(function(data){
        $scope.user_name = data.username;
        }).
    error(function(data){
        console.log(data);
        });

    //Main functions

    $scope.signOut = function() {
        $location.path('/login');
    };

    $scope.editProject = function(project_id) {
        findProject(project_id, function(projInd){
            if (projInd != -1) {
                $('#myModal').modal('show');
                $scope.projectToEdit = project_id;
                $scope.projectEditable = true;
                $scope.projectToAdd = $scope.results[projInd].project_name;
            }
        });
    };

    $scope.addProject = function() {
        if (!$scope.projectEditable) {
            dataServices.addProject($scope.projectToAdd, 1, function(result) {
                if (result) {
                    $scope.results.push({
                        project_id : result,
                        temporaryTask : '',
                        temporaryDate : 'today',
                        project_name : $scope.projectToAdd,
                        tasks : []
                    });
                    $scope.projectToAdd = '';
                    $('#myModal').modal('hide');
                }
                else {
                    console.log('Error!');
                }
            });
        }
        else {
            dataServices.editProject($scope.projectToEdit, $scope.projectToAdd, function(result){
                console.log(result);
                if (result) {
                     findProject($scope.projectToEdit, function(projInd){
                         if (projInd != -1) {
                             $scope.results[projInd].project_name = $scope.projectToAdd;
                             $scope.projectToEdit = -1;
                             $scope.projectEditable = false;
                             $scope.projectToAdd = '';
                             $('#myModal').modal('hide');
                         }
                     });
                 }
                else console.log('ERROR!');
            });
        }
    };

    $scope.deleteProject = function(projectId) {
        dataServices.deleteProject(projectId, function(result){
            if (result) {
                findProject(projectId, function(projInd){
                    if (projInd != 'error') {
                        $scope.results.splice(projInd, 1);
                    }
                });
            }
        })
    };

    $scope.editTask = function(project_id, task_id) {
        findTask(project_id, task_id, function(projInd, taskInd) {
            if (projInd != -1) {
                if (taskInd != -1) {
                    $scope.results[projInd].taskEditable = true;
                    $scope.results[projInd].taskToEdit = task_id;
                    $scope.results[projInd].temporaryTask = $scope.results[projInd].tasks[taskInd].task_name;
                    $scope.results[projInd].tasks.splice(taskInd, 1);
                }
            }
        })
    };

    $scope.editStatus = function(task_id, project_id) {

        findTask(project_id, task_id, function(projInd, taskInd){
            if (projInd != -1) {
                if (taskInd != -1) {
                    dataServices.editStatus(task_id, $scope.results[projInd].tasks[taskInd].task_status, function(result){
                    });
                }
            }
        });
    };

    $scope.deleteTask = function(task_id, project_id) {
        dataServices.deleteTask(task_id, function(result){
            if (result) {
                findTask(project_id, task_id, function(projInd, taskInd){
                    if (projInd != -1) {
                        if (taskInd != -1) {
                            $scope.results[projInd].tasks.splice(taskInd, 1);
                        }
                    }
                });
            }
        });
    };

    $scope.addTask = function(project_id, task_name, temporaryDate) {

        var myDate = moment();
        switch (temporaryDate) {
            case 'today':
                break;
            case 'tomorrow':
                myDate.add(1, 'days');
                break;
            case 'week':
                myDate.add(1, 'weeks');
                break;
            case 'month':
                myDate.add(1, 'months');
        }

        findProject(project_id, function(projInd){
            if (projInd != -1) {

                if (!$scope.results[projInd].taskEditable) {

                    dataServices.addTask(project_id, task_name, myDate.format(), function(result) {
                        if (result) {

                            $scope.results[projInd].tasks.push({
                                task_id: result,
                                task_name: task_name,
                                task_status: 0,
                                task_deadline: myDate.format()
                            });

                            resetParams(projInd);

                        }
                        else {
                            console.log('Error');
                        }
                    });

                }
                else {

                    dataServices.editTask($scope.results[projInd].taskToEdit, $scope.results[projInd].temporaryTask, myDate.format(), function(result){
                        if (result) {

                            console.log('Ok!');

                            $scope.results[projInd].tasks.push({
                                task_id: $scope.results[projInd].taskToEdit,
                                task_status: 0,
                                task_name: $scope.results[projInd].temporaryTask,
                                task_deadline: myDate.format()
                            });
                            $scope.results[projInd].tasks.sort(comparePriority);
                            resetParams(projInd);
                        }

                        else {
                            resetParams(projInd);
                        }

                    });

                }
            }
        });


    };


    // Additional Functions

    function resetParams(index) {
        $scope.results[index].temporaryDate = 'today';
        $scope.results[index].temporaryTask = '';
        $scope.results[index].taskToEdit = 0;
        $scope.results[index].taskEditable = false;
    }

    function sortData() {
        for (var i = 0; i < $scope.results.length; i++) {
            $scope.results[i].tasks.sort(comparePriority);
        }
    }

    function comparePriority(taskA, taskB) {
        return moment(taskA.task_deadline).dayOfYear() - moment(taskB.task_deadline).dayOfYear();
    }

    function findProject(project_id, done) {
        for (var i = 0; i < $scope.results.length; i++) {
            if (project_id == $scope.results[i].project_id) {
                done(i);
            }
            else {
                done(-1);
            }

        }
    }

    function findTask(project_id, task_id, done) {
        for (var i = 0; i < $scope.results.length; i++) {
            if (project_id == $scope.results[i].project_id) {
                for (var j = 0; j < $scope.results[i].tasks.length; j++) {
                    if (task_id == $scope.results[i].tasks[j].task_id) {
                        done(i,j);
                    }
                    else {
                        done (i, -1);
                    }
                }
            }
            else {
                done(-1);
            }

        }
    }

}]);

toDoControllers.controller('loginCtrl',['$scope', '$http', 'userServices', function($scope, $http, userServices){

    $('.alert').hide();

    $http({
        url: '/signout',
        method: 'GET'
    });

    $scope.username = '';
    $scope.password = '';

    $scope.submit = function() {
        userServices.signIn($scope.username, $scope.password, function(result){
              if (result) {
                  $('.alert').show();
              }
        });
    };

}]);

toDoControllers.controller('signUpCtrl', ['$scope', '$http', 'userServices', function($scope, $http, userServices){

    $('.alert').hide();

    $scope.username = '';
    $scope.password = '';

    $scope.signUp = function() {
        userServices.signUp($scope.username, $scope.password, function(result){
            if (result) {
                $('.alert').show();
            }
        });
    };

}]);


