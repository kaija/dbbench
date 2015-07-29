var express = require('express');
var router = express.Router();
var poolModule = require('generic-pool');
var couchbase = require('couchbase');

var db_username = 'Administrator';
var db_password = '';
var db_bucket = 'default';


var cluster = new couchbase.Cluster('couchbase://127.0.0.1');
var cm = cluster.manager(db_username, db_password);
cm.listBuckets(function(err, list){
  var bucketExist = false;
  for (i in list){
    if(list[i].name === db_bucket) {
        bucketExist = true;
      }
  }
  if(!bucketExist) {
    console.log('Bucket not exist\n');
  }
});

var pool = poolModule.Pool({
  name        : 'db',
  create      : function(callback) {
    var cluster = new couchbase.Cluster('couchbase://127.0.0.1');
    var bucket = cluster.openBucket(db_bucket);
    callback(null, bucket);
  },
  destroy     : function(client) {
    client.disconnect();
  },
  max         : 50,
  min         : 10
});

var counter = 0;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/create', function(req, res, next) {
  pool.acquire(function(err, client){
    var id = new Date().getTime();
    client.upsert(id.toString(), {id:id}, function(err, ret){
      res.send(ret);
      pool.release(client);
    });
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
