Yup.Routers.Router = Backbone.Router.extend({
  initialize: function(options) {
    this.$rootEl = options.$rootEl;

    // $(window).scroll(function() {
    //   // Check if scroll is near bottom
    //   if ($(window).scrollTop() + $(window).height() > $(document).height() - 1) {
    //     this.renderNextPage();
    //   }
    // }.bind(this));
  },

  routes: {
    "": "search",
    "feed": "feed",
    "users/:id": "userShow",
    "businesses/:id": "businessShow",
    "search(/:query)(/:order)": "search"
  },

  businessShow: function (id) {
    var business = new Yup.Models.Business({ id: id });
    business.fetch();

    var view = new Yup.Views.BusinessShow({
      model: business,
      collection: business.reviews()
    });
    this._swapView(view);
    this.sidebarRight && this.sidebarRight.remove();
    $('#content').css('width', '70%');
    $('#sidebar-right').css('border', 'none');
  },

  feed: function () {
    var reviews = new Yup.Collections.Reviews();
    reviews.fetch();
    var view = new Yup.Views.FeedShow({ collection: reviews });
    this._swapView(view);
    this._swapSidebar({ collection: new Yup.Collections.Businesses() });
    $('#content').css('width', '43%');
    $('#sidebar-right').css('border-left', '1px solid #c5bdbd');
  },

  renderBestOf: function () {
    var businesses = new Yup.Collections.Businesses();
    businesses.fetch({
      data: { bestOf: true }
    });
    this._swapSidebar({ collection: businesses });

    var view = new Yup.Views.SearchShow({
      template: JST['search/best_of'],
      collection: businesses,
      map: this.sidebarRight.map
    });
    this._swapView(view);
  },

  renderNextPage: function () {
    if (this._currentView.$el.attr('class') == 'search-show') {
      this._currentView.collection.fetch({
        remove: false,
        data: { bestOf: this._currentView.bestOf,
                searchKeys: this.query,
                page: this._currentView.collection.page + 1
              },
        success: function (businesses) {
          this._currentView.map.showNewResults(businesses.models);
        }.bind(this)
      });
    }
  },

  search: function (query, order) {
    $(window).off('scroll');
    $(window).scroll(function() {
      // When user scrolls to the bottom, load more results
      // TODO: Allow max of 20 results, then paginate
      if ($(window).scrollTop() + $(window).height() > $(document).height() - 1) {
        this.renderNextPage();
      }
    }.bind(this));


    if (!query || query == 'bestof') {
      this.renderBestOf();
      return;
    }
    this.query = query || 'restaurants';
    this.order = order || 'id';
    var businesses = new Yup.Collections.Businesses();
    businesses.fetch({
      data: { searchKeys: this.query }
    });

    this._swapSidebar({
      collection: businesses,
      query: this.query,
      order: this.order
    });

    var view = new Yup.Views.SearchShow({
      query: this.query,
      order: this.order,
      collection: businesses,
      map: this.sidebarRight.map
    });

    this._swapView(view);
    $('#content').css('width', '43%');
    $('#sidebar-right').css('border-left', '1px solid #c5bdbd');
  },

  _swapSidebar: function (options) {
    this.sidebarRight && this.sidebarRight.remove();
    this.sidebarRight = new Yup.Views.SidebarRight(options);
    $('#sidebar-right').html(this.sidebarRight.render().$el);
  },

  _swapView: function (view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;
    this.$rootEl.html(view.render().$el);
  },

  userShow: function (id) {
    var user = new Yup.Models.User({ id: id });
    user.fetch();
    var view = new Yup.Views.UserShow({
      model: user,
      collection: user.reviews()
    });

    this._swapView(view);
    this.sidebarRight && this.sidebarRight.remove();
    $('#content').css('width', '70%');
    $('#sidebar-right').css('border', 'none');
  },
});
