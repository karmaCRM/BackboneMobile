Backbone.Mobile = Mobile = (function(Backbone, _, $){
  var Mobile = {};
  return Mobile;
})(Backbone, _, $ || window.jQuery || window.Zepto || window.ender)

// Layout Manager / Main App Region
// Used to control the app and have special functions that other regions do not have
Backbone.Mobile.AppRegion = Backbone.Marionette.Region.extend({
  
})

Backbone.Mobile.Application = Backbone.Marionette.Application.extend({
  addAppRegion: function(regions){
    var that = this;
    _.each(regions, function (region, name) {
      var regionManager = Backbone.Mobile.AppRegion.buildRegion(region, Marionette.Region);
      that[name] = regionManager;
    });
  }
})