var connection = require('./db_connect').localConnect(),
    md5        = require('md5');

connection.connect();

exports.signIn = function signIn(username, password, done) {
    var sql = "SELECT * FROM Users WHERE email="+ connection.escape(username) +" and password="+ connection.escape(md5.digest_s(password)) + ' LIMIT 1;';
    connection.query(sql,
        function (err,results) {
            if (err) throw err;
            done(results);

        });
};

exports.signUp = function signUp(username, password, done) {

};