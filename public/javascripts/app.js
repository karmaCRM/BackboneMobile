// =======================================
// appwide helper utils
// =======================================

window.l = function(values){
  console.log(values)
}

// =======================================
// app init
// =======================================

window.App = new Backbone.Mobile.Application({
  Models: {},
  Collections: {},
  Routers: {},
  Views: {},
});

App.addAppRegion({
  appRegion: '#main'
});

// =======================================
// demo app codebase here
// =======================================

App.Routers.Main = Backbone.Router.extend({
  routes: {
    ".*" : "index",
  },
  index: function(){
    console.log('index....')      
  }
})
  
// =======================================
// initialize the app
// =======================================

App.addInitializer(function() {
  new App.Routers.Main()
});

App.on('initialize:after',function(){ 
  Backbone.history.start()
});