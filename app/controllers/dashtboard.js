import Ember from 'ember';
import { hasLocalStorage } from 'dasht/utils/feature-detect';

/**
  Dashtboard Homepage controller

  @class DashtboardController
*/
export default Ember.Controller.extend({
  needs: ['application'],
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
  Signal if quick search input is visible

  @property quickSearch
  @type Bool
  @default false
  */
  quickSearch: false,
  /**
  Signal if editing is turned on

  @property editing
  @type Bool
  @default false
  */
  editing: false,
  /**
  Signal if filter error messaging should be displayed

  @property showFilterMessaging
  @type Bool
  @default false
  */
  showFilterMessaging: true,
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
  Listen for filters turned on

  @methods observeOnFilters
  */
  observeOnFilters: function() {
    var onFilters = this.get('cachedFilters.allfilters').filterBy('on', true);
    this.set('onFilters', onFilters);
  }.observes('cachedFilters.allfilters.@each.on'),
  onFilters: null,
  onFiltersLength: Ember.computed.alias('onFilters.length'),
  onFiltersGreaterThanZero: Ember.computed.gt('onFiltersLength', 0),
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
  Hide or show channels from dashtboard

  @method toggleChannel
  */
  toggleChannel: function(channel, bool) {
    var currentModel = this.get('controllers.application').get('model'),
        found;
    if (currentModel && currentModel.library) {
      found = currentModel.library.findBy('title', channel);
      found.set('visible', bool);
      this.saveToLocal(currentModel);
    }
  },
  findChannel: function() {
    var currentModel = this.get('controllers.application').get('model');
    var channelsLib = currentModel.library;
    var query = this.get('channel');
    var partialTitleMatchArr = [];

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
    Toggle search input visibility

    @method toggleSearch
    */
    toggleSearch: function() {
      this.toggleProperty('quickSearch');
    },
    /**
    Toggle editing on and off

    @method editDash
    */
    editDash: function() {
      this.toggleProperty('editing');
    },
    /**
    Remove channel from dashtboard

    @method hideChannel
    */
    hideChannel: function(channel) {
      this.toggleChannel(channel, false);
    },
    /**
    Toggle filtering open or closed

    @method toggleFilters
    */
    toggleFilters: function() {
      this.toggleProperty('filtering');
    }
  }
});
