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
    App.addRegions({ listItemRegion: '#scroller'});

    // =======================================
    // demo app codebase here
    // =======================================
    App.Views.Home = Backbone.Marionette.ItemView.extend({
        template: '#home'
    });

    // ===================
    // = demo todo Model =
    // ===================
    App.Models.TodoItem = Backbone.Model.extend({
        defaults: {
            done: false
        },
        done: function() {
            this.set('done', true)
        },
        undone: function() {
            this.set('done', false)
        },
        prioritize: function() {
            this.set({
                priority: this.get('priority') + 1
            });
        },
        deprioritize: function() {
            this.set({
                priority: this.get('priority') - 1
            })
        }
    });

    // ========================
    // = demo todo collection =
    // ========================
    App.Collections.TodoItems = Backbone.Collection.extend({
        model: App.Models.TodoItem,

        initialize: function(items) {
            var priority = 1;
            _.each(items,
            function(item) {
                item.set('priority', priority);
            });

            this.on('items:add',
            function(item) {
                if (!item.get('priority')) {
                    var error = Error("Must have a priority set")
                    error.name = "NoPriorityError";
                    throw error;
                }
            })

            var collection = this;

            App.vent.on("item:prioritize",
            function(item) {
                if (item.get('priority') <= collection.getHighestPriority()) {
                    // item.set({priority: item.get('priority')+1})
                    item.prioritize();
                    // we're calling this directly on the model, if you need to add validation, etc.. we can add a method to the collection
                    collection.sort();
                } else {
                    return true
                }
            });

            App.vent.on("item:deprioritize",
            function(item) {
                if (item.get('priority') >= 1) {
                    item.deprioritize();
                    collection.sort();
                } else {
                    return true
                }
            });



            App.vent.on("item:done",
            function(item) {
                // collection.remove(item);
                item.destroy();
                collection.trigger('reset');
            });
        },
        //returns the highest priority thusfar
        getHighestPriority: function(items) {
            _.max(items,
            function(item) {
                return item.get('priority');
            });
        }
    });

    App.Views.TodoItemView = Backbone.Marionette.ItemView.extend({
        template: '#m-todoItem-template',
        tagName: 'li',
        className: 'm-list_item',

        events: {
            // 'click .add': 'addTodo',
            'click .done': 'completeTodo',
            'click .prioritize': 'prioritizeTodo',
            'click .deprioritize': 'deprioritizeTodo'
        },

        initialize: function() {
            this.bindTo(this.model, "change:priority", this.render)
            this.bindTo(this.model, "change:done", this.render)
        },

        completeTodo: function() {
            App.vent.trigger("item:done", this.model);
        },

        prioritizeTodo: function() {
            App.vent.trigger("item:prioritize", this.model);
        },

        deprioritizeTodo: function() {
            App.vent.trigger("item:deprioritize", this.model);
        }
    });

    App.Views.TodoItemsView = Backbone.Marionette.CompositeView.extend({
        tagName: 'div',
        id: 'm-todoItems',
        className: 'm-listItems',
        itemView: App.Views.TodoItemView,
        template: '#m-listItem-template',
				itemViewContainer: '#scroller-content'
    })


    App.Routers.Main = Backbone.Router.extend({
        routes: {
            ".*": "index",
        },
        index: function() {
            var mainView = new App.Views.Home()
            // var todoItems = new App.Views.TodoItemsView();
            App.mainRegion.show(mainView);
            // App.listItemRegion.show(todoItems);
            if (!App.overflowscrolling) {
                setTimeout(function() {
                    myScroll = new iScroll('wrapper');
                },
                100);
            }
        }
    })

    // =======================================
    // initialize the app
    // =======================================
    App.addInitializer(function(options) {
        new App.Routers.Main()
        App.overflowscrolling = $('html').hasClass('overflowscrolling');
        var todoItemsView = new App.Views.TodoItemsView({
            collection: options.items
        })
        window.todoItemsView = todoItemsView;
        App.listItemRegion.show(todoItemsView);
    });

    $(document).ready(function() {
        var items = new App.Collections.TodoItems([
        new App.Models.TodoItem({
            name: 'Buy Milk',
            priority: 1
        }),
        new App.Models.TodoItem({
            name: 'Take out trash',
            priority: 1
        }),
        new App.Models.TodoItem({
            name: 'Walk the dog',
            priority: 1
        })
        ]);

        App.on('initialize:after',
        function() {
            Backbone.history.start()
        });

        App.start({
            items: items
        })
    });


		// ============================================
		// = Scroll to refresh iScroll Implementation =
		// ============================================
		
		var myScroll,
			pullDownEl, pullDownOffset,
			pullUpEl, pullUpOffset,
			generatedCount = 0;

		function pullDownAction () {

			// todo: re-render based on a refreshed collection
			// App.Collections.TodoCollection.refresh()
			myScroll.refresh();
		}


		function loaded() {
			pullDownEl = document.getElementById('pullDown');
			pullDownOffset = pullDownEl.offsetHeight;


			myScroll = new iScroll('wrapper', {
				useTransition: true,
				topOffset: pullDownOffset,
				onRefresh: function () {
					if (pullDownEl.className.match('loading')) {
						pullDownEl.className = '';
						pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
					} 
				},
				onScrollMove: function () {
					if (this.y > 5 && !pullDownEl.className.match('flip')) {
						pullDownEl.className = 'flip';
						pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
						this.minScrollY = 0;
					} else if (this.y < 5 && pullDownEl.className.match('flip')) {
						pullDownEl.className = '';
						pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
						this.minScrollY = -pullDownOffset;
					} else if (this.y < (this.maxScrollY - 5)) {
						this.maxScrollY = this.maxScrollY;
					} 
				},
				onScrollEnd: function () {
					if (pullDownEl.className.match('flip')) {
						pullDownEl.className = 'loading';
						pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';				
						pullDownAction();	
					}
				}
			});

			setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
		}
		document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);
})(window);