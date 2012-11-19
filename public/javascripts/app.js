window.App = new Backbone.Mobile.Application({
  Models: {},
  Collections: {},
  Routers: {},
  Views: {},
});
  
App.addRegions({
  appRegion: '#main'
});

App.on('initialize:after',function(){ 
  console.log('here....')
  Backbone.history.start()
});