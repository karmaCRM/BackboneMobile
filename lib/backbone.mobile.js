Backbone.Mobile = Mobile = (function(Backbone, _, $){
  var Mobile = {};
  return Mobile;
})(Backbone, _, $ || window.jQuery || window.Zepto || window.ender)

Backbone.Mobile.AppRegion = Backbone.Marionette.Region.extend({})
Backbone.Mobile.View = Backbone.Marionette.View.extend({})
Backbone.Mobile.ItemView = Backbone.Marionette.ItemView.extend({})
Backbone.Mobile.CollectionView = Backbone.Marionette.CollectionView.extend({})
Backbone.Mobile.CompositeView = Backbone.Marionette.CompositeView.extend({})

Backbone.Mobile.Layout = Backbone.Marionette.Layout.extend({
  
  constructor: function () {
    this._firstRender = true;
    this.addHeaderRegion();
    this.addFooterRegion();
    this.initializeRegions();
    Backbone.Marionette.ItemView.apply(this, arguments);
  },
  
  addHeaderRegion: function(){
    this.regions['headerRegion'] = '#header'     
  },
  
  addFooterRegion: function(){
    this.regions['navRegion'] = '#nav'
  },

  initializeRegions: function () {
    if (!this.regionManagers){
      this.regionManagers = {};
    }

    var that = this;
    var regions = this.regions || {};
    
    _.each(regions, function (region, name) {
      var regionManager = Marionette.Region.buildRegion(region, that.regionType);
      regionManager.getEl = function(selector){
        return that.$(selector);
      };

      that.regionManagers[name] = regionManager;
      that[name] = regionManager;
    });
  },
  
  render: function(){
    if (this._firstRender){
      // if this is the first render, don't do anything to
      // reset the regions
      this._firstRender = false;
    } else {
      // If this is not the first render call, then we need to 
      // re-initializing the `el` for each region
      this.closeRegions();
      this.reInitializeRegions();
    }    

    var result = Marionette.ItemView.prototype.render.apply(this, arguments);

    if(result.headerRegion){ result.renderHeader(); }    
    if(result.navRegion){ result.renderNav(); }
          
    return result;
  },
  
  renderHeader: function(){ 
    view = this.buildHeaderView();
    this.headerRegion.show(view);
  },

  renderNav: function(){    
    view = this.buildNav();
    this.navRegion.show(view);
  },
  
  getHeaderOptions: function(){
    return this.headerOptions || {};
  },

  getNavOptions: function(){
    return this.navOptions || {};
  },
  
  buildHeaderView: function(){
    return new Backbone.Mobile.Header(this.getHeaderOptions());
  },
  
  buildNav: function(){
    return new Backbone.Mobile.Nav(this.getNavOptions());
  },

})

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

Backbone.Mobile.Header = Backbone.Marionette.View.extend({
  tagName: 'header',
  className: 'bar-title',
  
  initialize: function(options){
    this.options = options || {};
  },
  
  getTitle: function(){
    return (this.options && this.options.title) || '';
  },
  
  render: function(){
    this.$el.html(this.build());
    return this
  },
  
  build: function(){
    out = ''
    out += this.buildLeft();
    out += this.buildTitle();
    out += this.buildRight();
    return out
  },
  
  buildLeft: function(){
    return this.buildButton(this.options.leftButton || {});
  },

  buildTitle: function(){
    title = this.getTitle();
    out = ''
    if(title && title != ''){ out = '<h1 class="title">' + this.getTitle() + '</h1>'; }
    return out;
  },
  
  buildRight: function(){
    return this.buildButton(this.options.rightButton || {});
  },
  
  buildButton: function(options){
    out = '';
    type = options.type || ''
    text = options.text || '';
    href = options.href || '#';
    if(type && type == 'next'){ 
      out += '<a class="button-next button" href="' + href + '">Next</a>';
    } else if(type == 'back'){
      out += '<a class="button-prev button-edit button" href="' + href + '">Back</a>';    
    } else if(type == 'edit'){
      out += '<a class="button-edit button" href="' + href + '">Edit</a>';    
    } else if(type == 'save'){
      out += '<a class="button-save button" href="' + href + '">Save</a>';    
    } else if(type == 'cancel'){
      out += '<a class="button-cancel button" href="' + href + '">Cancel</a>';    
    } else if(options.text) {
      out += '<a class="button-edit button" href="' + href + '">' +  text +'</a>';
    }
    return out;    
  }
  
})

Backbone.Mobile.Nav = Backbone.Marionette.View.extend({
  tagName: 'nav',
  className: 'bar-tab',
  render: function(){
    this.$el.html('<ul class="tab-inner"><li class="tab-item"><a href=""><img class="tab-icon" src="img/icon-home.png"><div class="tab-label">Home</div></a></li></ul>');
    return this
  }
})