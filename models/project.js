var connection = require('./db_connect').localConnect();
connection.connect();

exports.deleteProject = function deleteProject(project_id, done) {
    console.log(project_id);
    var sql = "DELETE FROM projects WHERE id=" + connection.escape(project_id);
    connection.query(sql,
        function(err,data) {
            if (err) throw err;
            done(data);
        });
};

exports.addProject = function addProject(projectName, userId, done) {
    var sql = "INSERT INTO projects (name, user_id) VALUES (" + connection.escape(projectName) + "," + connection.escape(userId) +  ")";
    connection.query(sql,
        function(err,data) {
            if (err) throw err;
            console.log(data);
            done(data);
        });
};

exports.editProject = function editProject(project_id, project_name, done) {
    var sql = "UPDATE projects " +
        "SET name=" + connection.escape(project_name) + " " +
        "WHERE id=" + connection.escape(project_id);

    connection.query(sql,
        function(err,data){
            if (err) throw  err;
            console.log(data);
            done(data);
        });
};

exports.findProjects = function findProjects(user_id, done) {
    var sql = "SELECT p.id AS project_id, p.name AS project_name, t.id AS task_id, t.name AS task_name, " +
        "t.status AS task_status, t.project_id AS task_projectId, " +
        "t.deadline AS task_deadline " +
        "FROM projects AS p " +
        "LEFT JOIN tasks AS t " +
        "ON p.id = t.project_id " +
        "WHERE p.user_id = " + connection.escape(user_id);

    connection.query(sql, function(err,results){
        if (err) throw err;
        done(results);
    });
};