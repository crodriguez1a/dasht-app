import Ember from 'ember';
import { hasLocalStorage } from 'dasht/utils/feature-detect';

/**
  Add a Channel controller

  @class AddController
*/
export default Ember.Controller.extend({
  needs: ['dashtboard', 'application'],
  /**
  Sort default

  @property sortVisible
  @type Array
  */
  sortVisible: ['searchResult:desc', 'visible', 'title'],
  /**
  Channel lib sorted by visible (added) channels first, the alphabetical

  @property librarySortVisible
  @type Array
  */
  librarySortVisible: Ember.computed.sort('controllers.application.model.library', 'sortVisible'),
  /**
  Signal if filtering is open

  @property filtering
  @type Bool
  @default false
  */
  filtering: false,
  /**
  Cached version of filters, shared from dashtboard

  @property cachedFilters
  @type Object
  */
  cachedFilters: Ember.computed.alias('controllers.dashtboard.cachedFilters'),
  /**
  Bool to signal if filters have been applied

  @property currentlyFiltered
  @type Bool
  */
  currentlyFiltered: Ember.computed.notEmpty('cachedFilters'),
  /**
  Normalized object of message strings

  @property messages
  @type Object
  */
  messages: {
    noEntry: "Nothing to find.",
    noMatch: "Sorry. We couldn't find that channel.",
    serviceDown: "Oops. The service is down temporarily. Please try back in a few minutes.",
    noUrl: "Hmm, try searching for a url instead (ie: pbs.org).",
    prevInstalled: "Yep, that's already been added.",
    successInstalled: "Successfully added.",
    addingNew: "Thanks...we\'re adding this channel to your library. If you think this channel should be added permanently, please reach out.",
    partialFound: "Is it any of the ones highlighted? Otherwise, try searching for a url instead (ie: pbs.org)."
  },
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
    if (hasLocalStorage) {
      localStorage.setItem("dasht-channels", JSON.stringify(model));
    }
  },
  /**
  Bring results of partial matches to the front

  @property findPartialMatches
  */
  findPartialMatches: function() {
    var currentModel = this.get('controllers.application').get('model'),
        channelsLib = currentModel.library,
        query = this.get('channel'),
        partialTitleMatchArr = [];

    //clear previous searches
    channelsLib.setEach('searchResult', false);

    if (query) {
      //clean up query
      query = (query.replace(/ /g, '')).toLowerCase();
      //match hits
      channelsLib.filter(function(item) {
        var hits = (item.title).match(query);
        if (hits && hits.length > 0) {
          partialTitleMatchArr.push(item);
        }
      });
      //if partial match, bring those channels to front
      if (partialTitleMatchArr.length > 0) {
        return partialTitleMatchArr.setEach('searchResult', true);
      }
    }

  }.observes('channel'),
  actions: {
    /**
    Action, search for channels in model

    @method findChannel
    */
    findChannel: function() {
      var currentModel = this.get('controllers.application').get('model'),
          channelsLib = currentModel.library,
          query = this.get('channel'),
          partialMatch = channelsLib.isAny('searchResult', true);

      //clean up query
      if (query) {
        query = (query.replace(/ /g, '')).toLowerCase();
      }

      //match in db
      var exactURLMatch = channelsLib.findBy('url', '//'+query),
          exactTitleMatch = channelsLib.findBy('title', query);

      /*
        Search messaging
      */
      //nothing typed
      if (!query) {
        return this.get('controllers.application').addWarningMessage(this.messages.noEntry);
      } else {

        //partial match
        if (partialMatch) {
          var partials = channelsLib.filterBy('searchResult', true);
          //reset any previously highlighted matches
          channelsLib.setEach('highlight', false);
          partials.setEach('highlight', true);
          return this.get('controllers.application').addInfoMessage(this.messages.partialFound, 7000);
        }

        //not a url
        if (!(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/).test(query)) {
          if (!exactTitleMatch) {
            return this.get('controllers.application').addDangerMessage(this.messages.noUrl);
          }
        }

        //found a match
        if (exactURLMatch || exactTitleMatch) {
          var match = exactURLMatch || exactTitleMatch;
          if (match.get('visible')) {
            //already added to dashtboard
            return this.get('controllers.application').addInfoMessage(this.messages.prevInstalled);

          } else {
            //successfully installed found channel
            this.send('addChannel', match.get('title'));
            return this.get('controllers.application').addSuccessMessage(this.messages.successInstalled);

          }
        } else {
          //new channel being added to user lib
          this.addNewChannel(query);
          return this.get('controllers.application').addSuccessMessage(this.messages.addingNew, 10000);
        }
      }
    },
    /**
    Adds existing lib channel to dashtboard

    @method addChannel
    */
    addChannel: function(channel, visible) {
      if (!visible) {
        this.get('controllers.dashtboard').toggleChannel(channel, true);
        this.get('controllers.application').addSuccessMessage(this.messages.successInstalled);
      } else {
        this.get('controllers.application').addInfoMessage(this.messages.prevInstalled);
      }
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
