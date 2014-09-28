var connection = require('./db_connect').localConnect();
connection.connect();

exports.edit = function edit(task_id, task_name, task_deadline, done) {
    var sql = "UPDATE tasks " +
        "SET name=" + connection.escape(task_name) + ", deadline=" + connection.escape(task_deadline) + ", status='0' " +
        "WHERE id=" + connection.escape(task_id);

    connection.query(sql, function(err, data){
        if (err) throw err;
        done(data);
    });
};

exports.remove = function remove(task_id, done) {
    var sql = "DELETE FROM tasks WHERE id=" + connection.escape(task_id);

    connection.query(sql, function(err,data){
        if (err) throw err;
        done(data);
    })
};

exports.add = function add(project_id, task_name, task_deadline, done) {
    var sql = "INSERT INTO tasks (name, project_id, deadline, status) VALUES (" + connection.escape(task_name) + ", " +
        connection.escape(project_id) + ", " + connection.escape(task_deadline) + ", " +
        connection.escape(0) + ")";

    connection.query(sql, function(err,data){
        if (err) throw err;
        done(data);
    });
};

exports.editStatus = function editStatus(task_id, task_status, done) {

    console.log(task_status);

    var sql = "UPDATE tasks " +
        "SET status=" + connection.escape(task_status) + " "+
        "WHERE id=" + connection.escape(task_id);

    connection.query(sql, function(err,data){
        if (err) throw err;
        done(data);
    });
};
