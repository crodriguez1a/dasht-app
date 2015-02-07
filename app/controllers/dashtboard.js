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

  @property sortAlpha
  @type Array
  */
  sortAlpha: ['title'],
  /**
  Channel lib sorted alphabetically

  @property librarySortAlpha
  @type Array
  */
  librarySortAlpha: Ember.computed.sort('controllers.application.model.library', 'sortAlpha'),
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
  actions: {
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
