window.App = new Backbone.Mobile.Application({
  Models: {},
  Collections: {},
  Routers: {},
  Views: {},
});
  
App.addRegions({
  appRegion: '#main'
});

App.addInitializer = function(){
  new Backbone.Router()
}
  
App.on('initialize:after',function(){ 
  Backbone.history.start()
});