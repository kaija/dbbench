var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
var poolModule = require('generic-pool');
var uuid = require('node-uuid');
var pool = poolModule.Pool({
  name        : 'cassandra',
  create      : function(callback) {
    var client = new cassandra.Client({ contactPoints: ['127.0.0.1']});
    callback(null, client);
  },
  destroy     : function(client) {
    client.close();
  },
  max         : 100,
  refreshIdle : false,
  min         : 100,
  log         : false
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var setup_cmd = 'CREATE KEYSPACE penroses WITH REPLICATION = { \'class\' : \'SimpleStrategy\', \'replication_factor\' : 1 }; CREATE TABLE penroses.users ( id uuid PRIMARY KEY,  name text, email text, phone text, age int );';

router.get('/init', function(req, res, next) {
  pool.acquire(function(err, client){
    var id = new Date().getTime();
    console.log(setup_cmd);
    client.execute(setup_cmd, function(err, ret) {
      res.send(ret);
      pool.release(client);
    });
  });
});

router.get('/create', function(req, res, next) {
  pool.acquire(function(err, client){
    var id = new Date().getTime();
    var cmd = 'INSERT INTO penroses.users (id, name, email, phone, age) VALUES (' + uuid.v4()+', \'kevin\', \'kaija.chang@gmail.com\', \'0987654321\', 33);'
    client.execute(cmd, function(err, ret) {
      res.send(ret);
      pool.release(client);
    });
  });
});

router.get('/read', function(req, res, next) {
  pool.acquire(function(err, client){
    client.execute('SELECT * FROM penroses.users WHERE id = ?',['a4e97316-b32f-457c-b7c4-97a17785ea3d'] , { prepare: true} ,
    function(n, rows) {
      res.send(rows.rows);
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
    var del_cmd = 'DROP KEYSPACE penroses;';
    client.execute(del_cmd, function(err, ret){
      res.send(ret);
      pool.release(client);
    });
  });
});


module.exports = router;
