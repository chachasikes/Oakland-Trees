var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

MongoDB = function(host, port) {
  this.db= new Db('trees', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(err,db){
    console.log("mongodb:: got db " + err + " " + db );
    db.authenticate("admin","x2wNxpMSvfUJ", function(err2,db2) {
      console.log("mongodb::auth got db " + err2 + " " + db2 );
    });
  });
};

MongoDB.prototype.getCollection = function(callback) {
  this.db.collection('trees', function(error, c) {
    if( error ) callback(error);
    else callback(null, c);
  });
};

MongoDB.prototype.find_many_by = function(arguments,callback) {
  var myarguments = arguments;
  var mycallback = callback;
  this.getCollection(function(error, c) {
    if( error ) mycallback(error)
    else {
      if(arguments._id) arguments._id = c.db.bson_serializer.ObjectID.createFromHexString(arguments._id);
      c.find(myarguments).toArray(function(error, results) {
        if( error ) {
          console.log("mongo:: find many by error " + error);
          mycallback(error);
          return;
        }
        console.log("mongo:: find many by got n results " + results.length);
        mycallback(null, results);
      });
    }
  });
};

MongoDB.prototype.findAll = function(callback) {
  this.getCollection(function(error, c) {
    if( error ) callback(error)
    else {
      c.find().toArray(function(error, results) {
        if( error ) callback(error)
        else callback(null, results)
      });
    }
  });
};

MongoDB.prototype.count_all_by = function(blob,callback) {
  this.getCollection(function(error, c) {
    if( error ) callback(error,0)
    else {
      if(blob._id) blob._id = c.db.bson_serializer.ObjectID.createFromHexString(blob._id);
      c.find(blob).count(callback);
    }
  });
};

MongoDB.prototype.find_one_by_id = function(id, callback) {
  this.getCollection(function(error, c) {
    if( error ) callback(error)
    else {
      c.findOne({_id: c.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
        if( error ) callback(error)
        else callback(null, result);
      });
    }
  });
};

MongoDB.prototype.find_one_by = function(blob, callback) {
  var mycallback = callback;
  this.getCollection(function(error, c) {
    if( error ) {
      console.log("mongo:: error in find one by");
      mycallback(error)
    } else {

      if(blob._id) blob._id = c.db.bson_serializer.ObjectID.createFromHexString(blob._id);

      c.findOne(blob, function(error, result) {
        console.log(" mongo::find_one_by returning with error: " + error + " and result: ");
        console.log(result);
        if( error ) mycallback(error)
        else mycallback(null, result);
      });
    }
  });
};

MongoDB.prototype.find_by_facebook_id = function(facebook_id, callback) {
  this.getCollection(function(error, c) {
    if( error ) callback(error)
    else {
      c.findOne({facebook_id: facebook_id }, function(error, result) {
        if( error ) callback(error)
        else callback(null, result);
      });
    }
  });
};

MongoDB.prototype.find_by_sponsor_id = function(sponsor_id, callback) {
  this.getCollection(function(error, c) {
    if( error ) callback(error)
    else {
      c.find({sponsor_id: sponsor_id }).toArray(function(error, result) {
        if( error ) callback(error)
        else callback(null, result);
      });
    }
  });
};

MongoDB.prototype.save = function(agents, callback) {
  if( typeof(agents.length)=="undefined") agents = [agents];
  this.getCollection(function(error, c) {
    if( error ) callback(error)
    else {
      c.insert(agents, function() { callback(null, agents); });
    }
  });
};

MongoDB.prototype.update = function(agent, callback) {
  this.getCollection(function(error, c) {
    if( error ) callback(error)
    else {
      c.save(agent, function(err,result) { callback(null,[agent]); }); 
      // c.update(agent, function() { callback(null, [agent]); }); @TODO examine
    }
  });
};

MongoDB.prototype.destroy = function(agents, callback) {
  console.log("mongo::destroy");
  console.log(agents);
  //if( typeof(agents.length)=="undefined") agents = [agents];
  this.getCollection(function(error, c) {
    if( error ) {
      console.log("mongo::destroy error " + error);
      callback(error)
    } else {
      c.remove(agents, function(err,result) {
        console.log("mongo::destroy done " + err + " " + result );
        callback(null,[]);
      });
    }
  });
};

exports.MongoDB = MongoDB;
