var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient

var url = 'mongodb://10.1.201.133:27017/benchdb';

var poolModule = require('generic-pool');
var pool = poolModule.Pool({
  name        : 'db',
  create      : function(callback) {
    MongoClient.connect(url, function(err, db){
      if(err) console.log(err);
      callback(null, db);
    });
  },
  destroy     : function(client) {
    client.close();
  },
  max         : 100,
  min         : 100
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/create', function(req, res, next) {
  pool.acquire(function(err, client){
    var collection = client.collection('user');
    var id = new Date().getTime();
    collection.insert({id:2, name:'joe', sex:0, phone:id.toString()}, function(err, ret){
      res.send(ret);
      pool.release(client);
    });
  });
});

router.get('/read', function(req, res, next) {
  pool.acquire(function(err, client){
    var collection = client.collection('user');
    var id = new Date().getTime();
    collection.find({phone:'1438159233380'}).toArray(function(err, doc){
      res.send(doc);
    });
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
