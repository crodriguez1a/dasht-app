import Ember from 'ember';
import { raw as ajax } from 'ic-ajax';
import { hasLocalStorage } from 'dasht/utils/feature-detect';

var localStorageChannels = 'dasht-channels';

/**
  Application route

  @class ApplicationRoute
*/
export default Ember.Route.extend({
  title: 'Dasht',

  /**
    Fetches data from local storage (as string) and re-converts to Ember Object

    @property localModel
    @type Class
  */
  localModel: function() {
    var ls, channels;

    if (!hasLocalStorage) { return undefined; }

    ls = localStorage.getItem(localStorageChannels);
    channels = JSON.parse(ls);

    if (!ls) { return undefined; }

    // Channel data is already stored locally
    return this.modelize(channels);

  }.property(),

  /**
    Fetches data from JSON, returns promise

    @property restModel
    @type Promise
  */
  restModel: function() {
    var req = ajax({
      type: 'GET',
      url: '/assets/json/channels.json',
      processData: true
    });

    return req.then(
      function resolve(res) {
        var channels = res.response;
        return this.modelize(channels, true);

      }.bind(this)
    );
  }.property(),

  /**
    Returns deep merge of local and fetched data

    @method model
  */
  model: function() {
    var self = this,
        local = this.get('localModel'),
        rest = this.get('restModel');

    //Compare local cache to database
    if (local && rest) {
      return rest.then(function() {
        //If both are present, compare modified date
        var restmod = rest._result.modified,
            localmod = local.modified,
            stale = moment(restmod).isAfter(localmod);

        //if items were added or modified, merge with local
        if (local.library.length !== rest._result.library.length || stale) {
          var rl = rest._result.library,
              ll = local.library;
          rl.filter(function(restlib) {
            //push missing items
            if (!ll.findBy('title', restlib.title)) {
              ll.push(restlib);
            }
          });
        }

        return local;
      });
    }

    //No local cache? Fetch data.
    if (!local && rest) {
      return rest.then(function() {
        self.saveToLocal(rest._result);
        return rest._result;
      });
    }
  },

  /**
    Re-construct POJO as Ember Object

    @method modelize
  */
  modelize: function(channels, fetched) {
    //Breakdown of Channels Model
    /*
    Channels: {
      Modified: mod date of database, used to compare stored data with fetched data
      Library: [
        channel: {
          title: display title,
          icon: path/to/icon,
          url: path/to/website,
          tags: [],
          isdefault: to show on dashtboard as default channel,
          visible: alias of default - later toggled by user,
          isfiltered: channel can be filtered out, while still "visible" and pinned to dashtboard,
          new: this property is unused but may be used for user contributed channels in the future
        }
      ]
    }
    */
    var allLib = channels.library;
    var Channels = Ember.Object.extend({
          library: null,
          init: function() {
            this._super();
            this.set("library", []);
          }
        });
    var Library = Ember.Object.extend({
          init: function() {
            this._super();
          }
        });
    var _channels = Channels.create();

    allLib.filter(function(item) {
      var a = Library.create();

      a.setProperties({
        title: item.title,
        icon: item.icon,
        url: item.url,
        tags: item.tags,
        isdefault: item.isdefault,
        visible: (/true/).test(item.isdefault),
        isfiltered: false,
        new: false
      });

      if (!fetched) {
        a.set('visible', item.visible);
      }

      _channels.get("library").push(a);
    });

    _channels.set('modified', channels.modified);

    return _channels;
  },

  /**
    Update local storage item with latest model

    @method saveToLocal
  */
  saveToLocal: function(model) {
    if (hasLocalStorage) {
      localStorage.setItem(localStorageChannels, JSON.stringify(model));
    }
  },

  /**
    Event on body should also close menu

    @method bodyClick
  */
  bodyClick: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      Ember.$('body').on('touch click mouseover', function(e) {
        var isMenuOpen = this.controller.get('attrs.menuOpen');
        var isMenuClick = Ember.$(e.target).parentsUntil('site-menu').hasClass('site-menu');

        if (isMenuOpen && !isMenuClick) {
          this.controller.set('attrs.menuOpen', false);
        }
      }.bind(this));
    });
  },

  init: function() {
    this.bodyClick();
  },

  actions: {
    /**
      Close any open blocks

      @method willTransition
    */
    didTransition: function() {
      this._super();
      //hide menu
      this.controller.set('attrs.menuOpen', false);
      //toggle editing off
      this.controllerFor('dashtboard').set('editing', false);
    },
    /**
      Dev only - refreshes views

      @method invalidateModel
    */
    invalidateModel: function() {
      this.refresh();
    }
  }
});
