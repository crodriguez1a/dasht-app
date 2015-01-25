import Ember from 'ember';
import { raw as ic } from 'ic-ajax';

/**
* Add controller
*
* @class AddController
* @extends Ember.Controller
* @namespace Dasht
* @returns Class
*/

export default Ember.Controller.extend({
  needs: ['index','application'],
  /**
  Signal if filtering is open

  @property filtering
  @type Bool
  @default false
  */
  filtering: false,
  /**
  Cached version of filters that hold users choices

  @property cachedFilters
  @type Object
  @default null
  */
  cachedFilters: null,
  /**
  Bool to signal if filters have been applied

  @property currentlyFiltered
  @type Bool
  */
  currentlyFiltered: Ember.computed.notEmpty('cachedFilters'),
  /**
  Signal if message is an error message

  @property error
  @type Bool
  @default false
  */
  error: false,
  /**
  Message to be sent to message field

  @property message
  @type String
  @default null
  */
  message: null,
  /**
  Normalized object of message strings

  @property messages
  @type Object
  */
  messages: {
    noEntry: "Nothing to find.",
    noMatch: "Sorry. We couldn't find that channel.",
    serviceDown: "Oops. The service is down temporarily. Please try back in a few minutes.",
    noUrl: "Hmm, try searching for a url instead ('ie: pbs<b>.org</b>').",
    prevInstalled: "Yep, that's already been added.",
    successInstalled: "Successfully added.",
    addingNew: "Thanks...we\'re adding this channel to your library. If you think this channel should be added to our library, please email us at <a href='mailto:ideas@evolutionaryapps.com'>ideas@evolutionaryapps.com</a>"
  },
  /**
  Hides messaging still visible after 10s delay

  @method messageOut
  */
  messageOut: function() {
    Ember.run.later(this, function() {
      this.set('message', null);
    }, 10000);
  }.observes('message'),
  /**
  Push new channel to library as Ember Object

  @method addNewChannel
  */
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
      //free is a assumed, but we want to add at least one filterable tag
      tags: ["free"],
      new: true,
      visible: true,
      isfiltered: false
    });

    lib.push(newChannelModel);
    this.saveToLocal(currentModel);

  },
  /**
  Update local storage item with latest model

  @method saveToLocal
  */
  saveToLocal: function(model) {
    localStorage.setItem("dasht-channels", JSON.stringify(model));
  },
  actions: {
    /**
    Action, search for channels in model

    @method findChannel
    */
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

      /*
      find a channel messaging
      */

      //nothing typed
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

        //found a match
        if(exactURLMatch || exactTitleMatch){
          var match = exactURLMatch || exactTitleMatch;
          if(match.get('visible')) {
            //already added to dashtboard
            this.set('error', false);
            return this.set('message', this.messages.prevInstalled);
          }else {
            //successfully installed found channel
            this.send('addChannel', match.get('title'));
            this.set('error', false);
            return this.set('message', this.messages.successInstalled);
          }
        }else {
          //new channel being added to user lib
          this.set('error', false);
          this.addNewChannel(query);
          return this.set('message', this.messages.addingNew);
        }
      }


    },
    /**
    Clear out messages block

    @method closeMessage
    */
    closeMessage: function() {
      this.set('message', null);
    },
    /**
    Adds existing lib channel to dashtboard

    @method addChannel
    */
    addChannel: function(channel) {
      this.set('error', false);
      this.get('controllers.index').toggleChannel(channel, true);
      this.set('message', this.messages.successInstalled);
    },
    /**
    Toggles filtering open and closed

    @method toggleFilters
    */
    toggleFilters: function() {
      this.toggleProperty('filtering');
    }
  }
});
