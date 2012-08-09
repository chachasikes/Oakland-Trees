var trees = {};

window.onload = function() {

  trees.setupMap();
  trees.setupAddress();

  $('a[data-toggle="tab"]').on('shown', function (e) {
    if ($(e.target).attr('href') == '#map') {
      // force redraw by rezooming to the current zoom level - since map does not load when page loads if the tab is hidden. most of the map is set up, it just needs to be redrawn. can't find a redraw function in modest maps.
      var zoom = map.getZoom();
      map.zoom(zoom);
    }
  });

};


//
// Address handling (a back button) for twitter bootstrap
//
trees.setupAddress = function () {
  // Add a hash to the URL when the user clicks on a tab.
  // Not IE7 compatible but oh well. If we need that we can switch to jquery address.
  $('a[data-toggle="tab"]').bind('click', function(e) {
    history.pushState(null, null, $(this).attr('href'));
  });

  // Navigate to a tab when the history changes
  window.addEventListener("popstate", function(e) {
    var activeTab = $('[href=' + location.hash + ']');
    if (activeTab.length) {
      activeTab.tab('show');
    } else {
      $('.nav-tabs a:first').tab('show');
    }
  });
};

