/**
 * Lemonopoly data variable. Contains filtered object lists like 'activities', 'challenges', and 'challenge_statuses'
 */
trees.jsonData = {};

/**
 * Data loading wrapper for JSON formatted data, runs callback/closure to make sure data is really loaded.
 * vars contains the callback and other data to pass through to the later functions.
 */
trees.loadJSON = function(vars) {
  var vars = vars;
  var contentData = vars.path;
  var getData = $.ajax({
    url:  contentData,
    dataType: 'json',
    data: vars.data,
    success: trees.setData,
    error: trees.loadDataError
  });
  getData.vars = vars;
};

/**
 * Set data into jsonData object, then run callback.
 */
trees.setData = function(data, statusText, jqxhr) {
  if (data.length === undefined) {
    console.log("no results or undefined");
    return false;
  } 
  trees.jsonData[jqxhr.vars.dataName] = data;
  trees.jsonData[jqxhr.vars.dataName]["vars"] = jqxhr.vars;

  var callback = jqxhr.vars.callback;
  callback();

  return false;
};
