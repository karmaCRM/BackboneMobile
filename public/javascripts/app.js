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

App.setupMainRegion('#app');

// =======================================
// demo app codebase here
// =======================================

App.Views.Home = Backbone.Marionette.ItemView.extend({
  template: "",
  onRender: function(){
  }
})

App.Routers.Main = Backbone.Router.extend({
  routes: {
    ".*" : "index",
  },
  index: function(){
    view = new App.Views.Home()
    App.mainRegion.show(view)    
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