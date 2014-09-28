var config = require('../config/config').config;

var mysql = function localConnect(){
    return require('mysql').createConnection({
        host     : config.database.host,
        user     : config.database.login,
        password : config.database.password,
        database : config.database.name
    });
}

exports.localConnect = mysql;