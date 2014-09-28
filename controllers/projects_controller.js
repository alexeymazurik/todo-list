var Project = require('../models/project');

exports.add = function add(req,res){

    Project.addProject(req.body.project_name, req.user.id, function(data) {
        res.status(200).send('' + data.insertId);
    });

};

exports.remove = function remove(req,res){
    Project.deleteProject(req.body.project_id, function(data){
        res.status(200).send('' + data.insertId);
    });
};

exports.edit = function edit(req,res) {
    Project.editProject(req.body.project_id, req.body.project_name, function(data){
        res.status(200).send(data);
    })
};

exports.results = function(req,res){
    console.log(req.user);
    Project.findProjects(req.user.id, function(data){

        var results  = {},
            projects = [];

        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            if(!results[row.project_id]) {
                results[row.project_id] = {
                    project_id  : row.project_id,
                    project_name: row.project_name,
                    tasks       : []
                };
            }
            if (row.task_id) {
                results[row.project_id].tasks.push({
                    task_id: row.task_id,
                    task_name: row.task_name,
                    task_status: row.task_status ? true : false,
                    task_deadline: row.task_deadline
                });
            }
        }

        for (var project in results) {
            projects.push(results[project]);
        }

        res.send(projects);
        return projects;
    });
};