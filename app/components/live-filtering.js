import Ember from "ember";
import _ from 'lodash';

/**
Live Filtering component

Filter channels using tags

@class LiveFilteringComponent
*/
export default Ember.Component.extend({
  /**
  Alias for collection of filters

  @property filters
  @type Class
  */
  filters: Ember.computed.alias('buildFilters'),
  /**
  Allfilters array within filters object

  @property filtersArr
  @type Array
  */
  filtersArr: Ember.computed.alias('filters.allfilters'),
  /**
  Create model for filters collection

  @property buildFilters
  @type Class
  */
  buildFilters: function() {

    //todo: abstract this process

    //Breakdown of filters model
    /*
    Filters: {
      allfilters: [
        filter: {
          name: Display name,
          tag: App readable name to compare against channel tags,
          on: Bool signifiy filter/unfilter channel
        }
      ]
    }
    */

    //Template for filters model
    var FiltersModel = Ember.Object.extend({
      init: function() {
        this._super();
        this.set("allfilters", []);
      }
    }),

    _filters = FiltersModel.create();

    //plain old array of filters
    var poarr = [
    {
      name: 'Free',
      tag: 'free',
      on: true
    },{
      name: 'Subscription',
      tag: 'subscription',
      on: true
    },{
      name: 'A la carte',
      tag: 'alacarte',
      on: true
    },{
      name: 'Cast-ready',
      tag: 'castready',
      on: true
    }
    ];

    poarr.filter(function(item){
      var a = FiltersModel.create();
      a.setProperties({
        name: item.name,
        on: item.on,
        tag: item.tag
      });

      _filters.get("allfilters").push(a);
    });

    //if filters have already been cached, return cached filters
    var currentModel = this.get('controller').get('model');
    if(!currentModel.get('cachedFilters')){
      currentModel.set('cachedFilters', _filters);
      return _filters;
    }else {
      return currentModel.get('cachedFilters');
    }

  }.property(),
  /**
  Compare channel's tags with selected filters

  @method applyFilters
  */
  applyFilters: function() {
    var context = this.get('model'),
        model = context.model,
        lib = model.get('library'),
        useFilters = this.get('filters'),
        onFilters = useFilters.allfilters.filterBy('on', true),
        shouldApplyFilters = [];

    //Isolate filters that are turn on into an array
    onFilters.filter(function(item){
      shouldApplyFilters.push(item.tag);
    });

    //Iterate channels lib, toggle isfiltered property
    lib.filter(function(item){
      if(!item.isfiltered) {
        item.set('isfiltered', true);
      }
      //Compare channel tags to filters that are on
      shouldApplyFilters.filter(function(should){
        if(_.contains(item.tags, should)) {
          if(item.isfiltered) {
            item.set('isfiltered', false);
          }
        }
      });
    });

  },
  actions: {
    /**
    Designate filter on or off

    @method toggleFilter
    */
    toggleFilter: function(filter) {
      var filtersObj = this.get('filters'),
          currentFilter = filtersObj.get('allfilters'),
          foundFilter = currentFilter.findBy('name',filter);

      foundFilter.toggleProperty('on');
      this.applyFilters();
    },
    /**
    Save filter choices in local storage

    @method saveFilters
    */
    saveFilters: function() {
      //to do
    }
  }
});
