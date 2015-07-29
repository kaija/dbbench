var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var poolModule = require('generic-pool');
var pool = poolModule.Pool({
  name        : 'db',
  create      : function(callback) {
    var connection = mysql.createConnection({
      host    : '10.1.201.133',
      user    : 'bench',
      password: 'qwertyuiop',
      database: 'benchdb'
    });
    connection.connect();
    callback(null, connection);
  },
  destroy     : function(client) {
    client.end();
  },
  max         : 100,
  min         : 100,
  log         : false
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/create', function(req, res, next) {
  pool.acquire(function(err, client){
    var id = new Date().getTime();
    client.query('INSERT INTO `benchdb`.`benchdb` (`id`, `name`, `sex`, `phone`) VALUES (NULL, \'kevin\', \'0\', \''+id + '\');', function(err, ret) {
      //console.log('The solution is: ', rows);
      res.send(ret);
      pool.release(client);
    });
  });
});

router.get('/read', function(req, res, next) {
  pool.acquire(function(err, client){
    client.query('SELECT * FROM `test` WHERE `phone` = \'1438141448960\'', function(err, rows, fields) {
      //console.log('The solution is: ', rows);
      res.send(rows);
      pool.release(client);
    });
  });
});

router.get('/update', function(req, res, next) {
  pool.acquire(function(err, client){
    res.send("OK");
    pool.release(client);
  });
});

router.get('/delete', function(req, res, next) {
  pool.acquire(function(err, client){
    res.send("OK");
    pool.release(client);
  });
});


module.exports = router;
