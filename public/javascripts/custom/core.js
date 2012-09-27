function Core() { };

Core.query = function(filter,callback) {

  if(!filter || !callback) {
   // console.log("Kernel::query called with bad arguments");
    return;
  }

  //console.log("Kernel::query called with this filter: ");
  //console.log(filter);
  var jsonblob = JSON.stringify(filter);

  console.log(jsonblob);

  var mycallback = callback;
  var myurl = "/trees";

  $.post(myurl, filter , function(results) { Core.query_callback(results,mycallback); } );

  return;

  $.ajax(myurl, {
    type: 'POST',
    data: jsonblob,
    contentType: 'text/json',
    success: function(results) { Kernel.query_callback(results,mycallback); },
    error  : function() { Kernel.query_callback([],mycallback); }
  });
};


Core.query2 = function(path,callback) {
  $.ajax({
    url: path,
    dataType: 'json',
    success: callback,
    error: function(error) { console.log("Core::query error! " + error); return false; }
  });
}


Core.query_callback = function(results,mycallback) {

  // any data?
  //console.log("kernel::query:: json call done " + results.length );

  if(!results) {
    //console.log("kernel::query BADNESS got nothing!");
    if(mycallback)mycallback([]);
    return;
  }

  if (typeof results === "undefined") {
    //console.log("kernel::query BAD ERROR got nothing 2!");
    if(mycallback)mycallback([]);
    return;
  }

  if(results.length < 1) {
    //console.log("kernel::query got empty set back from server");
    if(mycallback)mycallback([]);
    return;
  }

  // aside from saving all incoming objects to the database, a subset of them may be callback passed to caller

  var filtered_set = [];

  // cache any new data locally (overwriting existing)

  for(var i in results) {
    var agent = results[i];
/*
    //console.log("Kernel::query got :");
    //console.log(agent);
*/
    if(!agent) {
      //console.log("kernel::query BAD ERROR! skipping empty candidate");
      continue;
    }
    if (typeof agent === "undefined") {
      //console.log("kernel::query BAD ERROR! skipping corrupt candidate");
      continue;
    }
    var id = agent["_id"];
    if(!id) {
      //console.log("kernel::query BAD ERROR! skipping candidate since it has no id");
      continue;
    }

    // mark as visible

    agent.visible = true;
      
//    Kernel.save_local(agent);

    //console.log("kernel::query result ");
    //console.log(agent);

    filtered_set.push(agent);
 
  }

  // Pass matching candidates back to the caller
  // @TODO it was supposed to pass back an array but is passing back a hash

  mycallback(filtered_set);

};
