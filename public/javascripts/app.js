window.App = new Backbone.Marionette.Application({
  Models: {},
  Collections: {},
  Routers: {},
  Views: {},
});
  
App.addRegions({
  appRegion: '#main'
});

App.on('initialize:after',function(){ 
  Backbone.history.start()
});