var Task = require('../models/task');

exports.add = function add(req, res){
    Task.add(req.body.project_id, req.body.task_name, req.body.task_deadline, function(data){
        res.status(200).send('' + data.insertId);
    });
};

exports.remove = function (req,res){
    Task.remove(req.body.task_id, function(data){
        res.status(200).send(data);
    });
};

exports.edit = function edit(req,res){
    Task.edit(req.body.task_id, req.body.task_name, req.body.task_deadline, function(data){
        res.status(200).send(data);
    })
};

exports.editStatus = function editStatus(req,res) {
    Task.editStatus(req.body.task_id, req.body.task_status, function(data){
        res.status(200).send(data);
    })
};