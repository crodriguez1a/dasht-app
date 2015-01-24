import Ember from "ember";
import _ from 'lodash';

/**
Live Filtering component

Filter channels using tags

@class LiveFilteringComponent
*/
export default Ember.Component.extend({
  filters: Ember.computed.alias('buildFilters'),
  buildFilters: function() {

    //todo: abstract this process
    var FiltersModel = Ember.Object.extend({
      init: function() {
        this._super();
      }
    }),

    _filters = FiltersModel.create();

    _filters.set("allfilters",[]);

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

    var currentModel = this.get('controller').get('model');
    if(!currentModel.get('cachedFilters')){
      currentModel.set('cachedFilters', _filters);
      return _filters;
    }else {
      return currentModel.get('cachedFilters');
    }

  }.property(),
  applyFilters: function() {
    var context = this.get('model'),
        model = context.model,
        lib = model.get('library'),
        useFilters = this.get('filters'),
        onFilters = useFilters.allfilters.filterBy('on', true),
        shouldApplyFilters = [];

    onFilters.filter(function(item){
      shouldApplyFilters.push(item.tag);
    });

    lib.filter(function(item){
      if(!item.isfiltered) {
        item.set('isfiltered', true);
      }
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
    toggleFilter: function(filter) {
      var filtersObj = this.get('filters'),
          currentFilter = filtersObj.get('allfilters'),
          foundFilter = currentFilter.findBy('name',filter);

      foundFilter.toggleProperty('on');
      this.applyFilters();
    },
    saveFilters: function() {
      //to do
    }
  }
});
