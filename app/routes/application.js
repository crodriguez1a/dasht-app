import Ember from 'ember';
import { raw as ic } from 'ic-ajax';
import _ from 'lodash';


export default Ember.Route.extend({
  saveToLocal: function(model) {
    localStorage.setItem("dasht-channels", JSON.stringify(model));
  },
  localModel: function(){
    var ls = localStorage.getItem("dasht-channels"),
        channels = JSON.parse(ls);
    if(ls !== null){
      return this.modelize(channels);
    }else {
      return undefined;
    }
  }.property(),
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
  model: function() {
    var self = this,
        local = this.get('localModel'),
        rest = this.get('restModel'),
        today = moment().format('YYYY-MM-DD hh:mm:ss'),
        M;

    //Compare local cache to database
    if(local && rest) {
      return rest.then(function(){
        //If both are present, compare modified date
        var restmod = rest._result.modified,
            localmod = local.modified,
            stale = moment(restmod).isAfter(localmod);

        //if items were added or modified, merge with local
        if(local.library.length !== rest._result.library.length || stale) {
          M = Ember.merge(local, rest._result);

          //Can't delete new items that were added by users

          self.saveToLocal(M);
          return M;
        }else {
          //otherwise just use local
          return local;
        }
      });
    }

    //No local cache? Fetch data.
    if(!local && rest){
      return rest.then(function(){
        M = rest._result;
        self.saveToLocal(M);
        return M;
      });
    }



  },
  modelize: function(channels, isnew) {

    var allLib = channels.library;
    var Channels = Ember.Object.extend({
          library: null,
          init: function() {
            this._super();
            this.set("library", []);
          }
        }),

        LibraryModel = Ember.Object.extend({
          init: function() {
            this._super();
          }
        }),

        _channels = Channels.create();

    allLib.filter(function(item){
      var a = LibraryModel.create();
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

      if(!isnew) {
        a.set('visible', item.visible);
      }

      _channels.get("library").push(a);
    });

    _channels.set('modified', channels.modified);

    return _channels;

  },
  bodyClick: function() {
    var self = this;
    Ember.run.schedule('afterRender', function(){
      $('body').on('touch click', function(e){
        var isMenu = $(e.target).parent().hasClass('site-menu'),
            menuBars = $(e.target).parent().hasClass('menu-bars');
        if(!isMenu && !menuBars) {
          self.controllerFor('application').set('menuOpen', false);
        }
      });
    });
  },
  init: function() {
    this.bodyClick();
  },
  actions: {
    toggleMenu: function() {
      this.controllerFor('application').toggleProperty('menuOpen');
    },
    invalidateModel: function() {
      this.refresh();
    }
  }
});
