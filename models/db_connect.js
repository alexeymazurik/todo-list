var config = require('../config/config');

var mysql = function localConnect(){
    //Node Mysql dependency npm install mysql@2.0.0-alpha7
    return require('mysql').createConnection({
        host     : config.database.host,
        user     : config.database.login,
        password : config.database.password,
        database : config.database.name,
        port     : config.database.port
    });
}

exports.localConnect = mysql;