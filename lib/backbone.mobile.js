Backbone.Mobile = Mobile = (function(Backbone, _, $){
  var Mobile = {};
  return Mobile;
})(Backbone, _, $ || window.jQuery || window.Zepto || window.ender)

// Layout Manager/Main App Region
// Used to control the app and have special functions that other regions do not have
Backbone.Mobile.AppRegion = Backbone.Marionette.Region.extend({})
Backbone.Mobile.View = Backbone.Marionette.View.extend({})
Backbone.Mobile.ItemView = Backbone.Marionette.ItemView.extend({})
Backbone.Mobile.CollectionView = Backbone.Marionette.CollectionView.extend({})
Backbone.Mobile.CompositeView = Backbone.Marionette.CompositeView.extend({})
Backbone.Mobile.Layout = Backbone.Marionette.Layout.extend({})
Backbone.Mobile.Application = Backbone.Marionette.Application.extend({
  
  // ------------------------------------
  // possibly add app init code here, determining platform etc
  // ------------------------------------
  setupMainRegion: function(name){
    var that = this;
    var regionManager = Backbone.Mobile.AppRegion.buildRegion(name, Marionette.Region);
    that['mainRegion'] = regionManager;
  }
})