var express = require('express');
var router = express.Router();
var poolModule = require('generic-pool');
var pool = poolModule.Pool({
  name        : 'db',
  create      : function(callback) {
    callback(null, new Object());
  },
  destroy     : function(client) {
  },
  max         : 50,
  min         : 10
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/create', function(req, res, next) {
  pool.acquire(function(err, client){
    res.send("OK");
    pool.release(client);
  });
});

router.get('/read', function(req, res, next) {
  pool.acquire(function(err, client){
    res.send("OK");
    pool.release(client);
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
