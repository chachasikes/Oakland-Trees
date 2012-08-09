function Core() { };

Core.query2 = function(filename,callback) {
  $.ajax({
    url: "/data/"+filename+".json",
    dataType: 'json',
    success: callback,
    error: function(error) { console.log("Kernel::query2 error! " + error); return false; }
  });
}
