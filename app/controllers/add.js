import Ember from 'ember';
import { raw as ic } from 'ic-ajax';

export default Ember.Controller.extend({
  needs: ['index','application'],
  error: false,
  filtering: false,
  cachedFilters: null,
  currentlyFiltered: Ember.computed.notEmpty('cachedFilters'),
  message: null,
  messages: {
    noEntry: "Nothing to find.",
    noMatch: "Sorry. We couldn't find that channel.",
    serviceDown: "Oops. The service is down temporarily. Please try back in a few minutes.",
    noUrl: "Hmm, try searching for a url instead ('ie: pbs<b>.org</b>').",
    prevInstalled: "Yep, that's already been added.",
    successInstalled: "Successfully added.",
    addingNew: "Thanks...we\'re adding this channel to your library. If you think this channel should be added to our library, please email us at <a href='mailto:ideas@evolutionaryapps.com'>ideas@evolutionaryapps.com</a>"
  },
  messageOut: function() {
    Ember.run.later(this, function() {
      this.set('message', null);
    }, 10000);
  }.observes('message'),
  addNewChannel: function(newchannel) {
    var currentModel = this.get('controllers.application').get('model'),
        lib = currentModel.get('library'),
        libModel = Ember.Object.extend({
          init: function() {
            this._super();
          }
        }),
        newChannelModel = libModel.create();

    newChannelModel.setProperties({
      title: newchannel.replace(/(\.*)\.[^.]+/, ''),
      icon: "/assets/icons/new.png",
      url: "//"+newchannel,
      tags: ["free"],
      new: true,
      visible: true,
      isfiltered: false
    });

    lib.push(newChannelModel);
    this.saveToLocal(currentModel);

  },
  saveToLocal: function(model) {
    localStorage.setItem("dasht-channels", JSON.stringify(model));
  },
  actions: {
    findChannel: function() {
      var currentModel = this.get('controllers.application').get('model'),
          channelsLib = currentModel.library,
          query = this.get('channel');

      //match in db
      var exactURLMatch = channelsLib.findBy('url','//'+query),
          exactTitleMatch = channelsLib.findBy('title', query);

      //clear any previous errors
      if(this.get('message') != null) {
        this.set('error', false);
        this.set('message', null);
      }

      //find a channel messaging
      if(!query) {
        this.set('error', true);
        return this.set('message', this.messages.noEntry);
      }else {

        //not a url
        if(!(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/).test(query)) {
          if(!exactTitleMatch) {
            this.set('error', true);
            return this.set('message', this.messages.noUrl);
          }
        }


        if(exactURLMatch || exactTitleMatch){
          var match = exactURLMatch || exactTitleMatch;
          if(match.get('visible')) {
            this.set('error', false);
            return this.set('message', this.messages.prevInstalled);
          }else {
            this.send('addChannel', match.get('title'));
            this.set('error', false);
            return this.set('message', this.messages.successInstalled);
          }
        }else {
          //add loader
          this.set('error', false);
          this.addNewChannel(query);
          return this.set('message', this.messages.addingNew);
        }
      }


    },
    closeMessage: function() {
      this.set('message', null);
    },
    addChannel: function(channel) {
      this.get('controllers.index').toggleChannel(channel, true);
      this.set('message', this.messages.successInstalled);
    },
    toggleFilters: function() {
      this.toggleProperty('filtering');
    }
  }
});
