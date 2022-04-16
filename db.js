var mysql = require('mysql');

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'tmdwns12',
  port     : 3306,
  database : 'pro'
});

db.connect();

module.exports = db;