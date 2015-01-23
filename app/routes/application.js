import Ember from 'ember';
import { raw as ic } from 'ic-ajax';

export default Ember.Route.extend({
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
        return this.modelize(channels);

      }.bind(this)
    );
  }.property(),
  model: function() {
    return this.get('localModel') || this.get('restModel');
  },
  modelize: function(channels) {
    var allLib = channels.library;
    var Channels = Ember.Object.extend({
          defaults: null,
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
        visible: item.visible === undefined ? false : item.visible,
        isfiltered: false
      });

      _channels.get("library").push(a);
    });

    //This is only needed when fetching, defaults are separate in JSON
    if(channels && channels.defaults) {
      var defLib = channels.defaults;

      defLib.filter(function(item){
        var d = LibraryModel.create();
        d.setProperties({
        title: item.title,
        icon: item.icon,
        url: item.url,
        tags: item.tags,
        visible: item.visible === undefined ? true : item.visible
        });

        _channels.get("library").push(d);
      });
    }

    localStorage.setItem("dasht-channels", JSON.stringify(_channels));

    return _channels;

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