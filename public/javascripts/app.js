(function() {
    // =======================================
    // appwide helper utils
    // =======================================
    window.l = function(values) {
        console.log(values)
    }
			
    // =======================================
    // app init
    // =======================================
    window.App = new Backbone.Mobile.Application({
        Models: {},
        Collections: {},
        Routers: {},
        Views: {}
    });

    App.setupMainRegion('#app');

    // =======================================
    // demo app codebase here
    // =======================================
      
    App.Models.Todo = Backbone.Model.extend({})
    App.Collections.Todos = Backbone.Collection.extend({ model: App.Models.Todo})
  
    App.Views.TodoItemView = Backbone.Mobile.ItemView.extend({
      template: '#m-todoItem-template',
      tagName: 'li'
    })

    App.Views.TodoItemsView = Backbone.Mobile.CompositeView.extend({
      tagName: 'div',
      id: 'm-todoItems',
      className: 'm-listItems',
      itemView: App.Views.TodoItemView,
      template: '#m-listItem-template',
      itemViewContainer: '#scroller-content'
    })
    
    App.Views.Todos = Backbone.Mobile.Layout.extend({
      template: '#todos',
      headerOptions: { title: 'Todos' },
      regions: {
        contentRegion: '.content'        
      },
      initialize: function(options){
        this.collection = options.collection
      },
      onRender: function(){
        view = new App.Views.TodoItemsView({ collection: this.collection });
        this.contentRegion.show(view);
      }
    });

    App.Views.TodoShow = Backbone.Mobile.Layout.extend({
        template: '#todos_show',
        regions: {
          contentRegion: '.content'        
        },
        getHeaderOptions: function(){
          return { 
            title : this.model && this.model.get('name'),
            leftButton: { type: 'back', href: '#/tasks' },
            rightButton: { type: 'edit', href: '#/tasks/' + this.model.id + '/edit' }
          };
        }
    })

    App.Views.TodoEdit = Backbone.Mobile.Layout.extend({
        template: '#todos_edit',
        regions: {
          contentRegion: '.content'        
        },
        getHeaderOptions: function(){
          return { 
            title : 'Edit',
            leftButton: { type: 'cancel', href: '#/tasks/' + this.model.id },
            rightButton: { type: 'save' }
          };
        }
    })
      
    App.Routers.Main = Backbone.Router.extend({
        routes: {
            ".*" : "index",
            "tasks" : "index",
            "tasks/:id" : "show",
            "tasks/:id/edit" : "edit"
        },
        initialize: function(){
          this.collection = new App.Collections.Todos([
            { name: 'Buy Milk', priority: 1, id: _.uniqueId() },
            { name: 'Stff Milk', priority: 1, id: _.uniqueId() },
            { name: 'Buy Milk', priority: 1, id: _.uniqueId() },
            { name: 'More....', priority: 1, id: _.uniqueId() },
            { name: 'Buy Milk', priority: 1, id: _.uniqueId() },
            { name: 'More Milk', priority: 1, id: _.uniqueId() },
            { name: 'Buy Milk', priority: 1, id: _.uniqueId() },
            { name: 'Buy Milk', priority: 1, id: _.uniqueId() },
            { name: 'Buy More', priority: 1, id: _.uniqueId() },
            { name: 'Buy Milk', priority: 1, id: _.uniqueId() },
            { name: 'Buy Milk', priority: 1, id: _.uniqueId() },
            { name: 'More Milk', priority: 1, id: _.uniqueId() },
            { name: 'MoreMore', priority: 1, id: _.uniqueId() }
          ]);
        },
        index: function() {
            var mainView = new App.Views.Todos({collection: this.collection});
            App.mainRegion.show(mainView);
            // if (!App.overflowscrolling) {
            //     setTimeout(function() {
            //         myScroll = new iScroll('wrapper');
            //     },
            //     100);
            // }
        },
        show: function(id) {
            var mainView = new App.Views.TodoShow({ model: this.collection.get(id) })
            App.mainRegion.show(mainView);
        },
        edit: function(id) {
            console.log('edit..')
            var mainView = new App.Views.TodoEdit({ model: this.collection.get(id) })
            App.mainRegion.show(mainView);
        }

    })

    // =======================================
    // initialize the app
    // =======================================
  
    App.addInitializer(function(options) {
        new App.Routers.Main()
    });
    
    $(document).ready(function() {
        App.on('initialize:after',
        function() {
            Backbone.history.start()
        });
        App.start({})
    });    
    
    // removes the 300MS touch delay on IOS
    window.addEventListener('load', function() { new FastClick(document.body); }, false); 
    
    // // ============================================
    // // = Scroll to refresh iScroll Implementation =
    // // ============================================
    // 
    // var myScroll,
    //  pullDownEl, pullDownOffset,
    //  pullUpEl, pullUpOffset,
    //  generatedCount = 0;
    // 
    // function pullDownAction () {
    // 
    //  // todo: re-render based on a refreshed collection
    //  // App.Collections.TodoCollection.refresh()
    //  myScroll.refresh();
    // }
    // 
    // 
    // function loaded() {
    //  pullDownEl = document.getElementById('pullDown');
    //  pullDownOffset = pullDownEl.offsetHeight;
    // 
    // 
    //  myScroll = new iScroll('wrapper', {
    //    useTransition: true,
    //    topOffset: pullDownOffset,
    //    onRefresh: function () {
    //      if (pullDownEl.className.match('loading')) {
    //        pullDownEl.className = '';
    //        pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
    //      } 
    //    },
    //    onScrollMove: function () {
    //      if (this.y > 5 && !pullDownEl.className.match('flip')) {
    //        pullDownEl.className = 'flip';
    //        pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
    //        this.minScrollY = 0;
    //      } else if (this.y < 5 && pullDownEl.className.match('flip')) {
    //        pullDownEl.className = '';
    //        pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
    //        this.minScrollY = -pullDownOffset;
    //      } else if (this.y < (this.maxScrollY - 5)) {
    //        this.maxScrollY = this.maxScrollY;
    //      } 
    //    },
    //    onScrollEnd: function () {
    //      if (pullDownEl.className.match('flip')) {
    //        pullDownEl.className = 'loading';
    //        pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';        
    //        pullDownAction(); 
    //      }
    //    }
    //  });
    // 
    //  setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
    // }
})(window);