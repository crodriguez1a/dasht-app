import Ember from 'ember';
import { raw as ic } from 'ic-ajax';

/**
* Application route
*
* @class ApplicationRoute
* @extends Ember.Route
* @namespace Dasht
* @returns Class
*/


export default Ember.Route.extend({
  /**
  Fetches data from local storage (as string) and re-converts to Ember Object

  @property localModel
  @type Class
  */
  localModel: function(){
    var ls = localStorage.getItem("dasht-channels"),
        channels = JSON.parse(ls);
    if(ls !== null){
      return this.modelize(channels);
    }else {
      return undefined;
    }
  }.property(),
  /**
  Fetches data from JSON, returns promise

  @property restModel
  @type Promise
  */
  restModel: function() {
    var req = ic({
      type: 'GET',
      url: '/assets/json/channels.json',
      processData: true,
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
    if(local && rest) {
      return rest.then(function(){
        //If both are present, compare modified date
        var restmod = rest._result.modified,
            localmod = local.modified,
            stale = moment(restmod).isAfter(localmod);

        //if items were added or modified, merge with local
        if(local.library.length !== rest._result.library.length || stale) {

          var rl = rest._result.library,
              ll = local.library;
          rl.filter(function(restlib){
            //push missing items
            if(!ll.findBy('title', restlib.title)) {
              ll.push(restlib);
            }
          });
        }

        return local;

      });
    }

    //No local cache? Fetch data.
    if(!local && rest){
      return rest.then(function(){
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

    var allLib = channels.library,
        //var
        Channels = Ember.Object.extend({
          library: null,
          init: function() {
            this._super();
            this.set("library", []);
          }
        }),
        //var
        Library = Ember.Object.extend({
          init: function() {
            this._super();
          }
        }),
        //var
        _channels = Channels.create();

    allLib.filter(function(item){
      var a = Library.create();
      a.setProperties({
        title: item.title,
        icon: item.icon,
        url: item.url,
        tags: item.tags,
        isdefault: item.isdefault,
        visible: item.isdefault,
        isfiltered: false,
        new: false
      });

      if(!fetched) {
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
    localStorage.setItem("dasht-channels", JSON.stringify(model));
  },
  /**
  Event on body should also close menu

  @method bodyClick
  */
  bodyClick: function() {
    var self = this;
    Ember.run.schedule('afterRender', function(){
      Ember.$('body').on('touch click', function(e){
        var isMenu = Ember.$(e.target).parentsUntil('site-menu').hasClass('site-menu');

        if(!isMenu) {
          self.controller.set('attrs.menuOpen', false);
        }
      });
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
      this.controllerFor('index').set('editing', false);
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
