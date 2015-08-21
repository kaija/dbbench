var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
var poolModule = require('generic-pool');
var pool = poolModule.Pool({
  name        : 'elasticsearch',
  create      : function(callback) {
    var client = new elasticsearch.Client({
      host: 'localhost:9200',
      log : 'warning',
      forever:  true
    });
    callback(null, client);
  },
  destroy     : function(client) {
    delete client;
  },
  max         : 100,
  min         : 100,
  refreshIdle : false,
  log         : false
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/create', function(req, res, next) {
  pool.acquire(function(err, client) {
    if (err) console.log(err);
    var id = new Date().getTime();
    var data = {
      index: 'myindex',
      type : 'mytype',
      body : {
        id: id,
        name: 'kevin',
        phone: id.toString(),
        sex: 'male'
      }
    };
    client.create(data, function(err, ret){
      if (err) console.log(err);
      res.send(ret);
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
