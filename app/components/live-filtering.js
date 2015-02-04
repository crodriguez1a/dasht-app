import Ember from 'ember';
import _ from 'lodash';

/**
  Live Filtering component

  Filter channels using tags

  @class LiveFilteringComponent
*/
export default Ember.Component.extend({
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
    noMatch: "Sorry, there are no channels that match that criteria. Try un-checking some filters or <a href='/add'>adding channels</a>."
  },
  /**
    Alias for collection of filters

    @property filters
    @type Class
  */
  filters: Ember.computed.alias('buildFilters'),

  /**
    Alias for categorized groups of filters

    @property filtersGroupGenres
    @type Class
  */
  filtersGroupGenres: Ember.computed.filterBy('filtersArr', 'group', 'genres'),
  /**
    Signal if any of the filters in this group are on

    @property genresFilterOn
    @type Bool
  */
  genresFilterOn: function() {
    return this.get('filtersGroupGenres').isAny('on');
  }.property('filtersArr.@each.on'),
  /**
    Alias for categorized groups of filters

    @property filtersGroupGenres
    @type Class
  */
  filtersGroupAvailability: Ember.computed.filterBy('filtersArr', 'group', 'availablity'),
  /**
    Signal if any of the filters in this group are on

    @property availabilityFilterOn
    @type Bool
  */
  availabilityFilterOn: function() {
    return this.get('filtersGroupAvailability').isAny('on');
  }.property('filtersArr.@each.on'),
  /**
    Alias for categorized groups of filters

    @property filtersGroupContent
    @type Class
  */
  filtersGroupContent: Ember.computed.filterBy('filtersArr', 'group', 'content'),
  /**
    Signal if any of the filters in this group are on

    @property contentFilterOn
    @type Bool
  */
  contentFilterOn: function() {
    return this.get('filtersGroupContent').isAny('on');
  }.property('filtersArr.@each.on'),
  /*
    Allfilters array within filters object

    @property filtersArr
    @type Array
  */
  sortAlpha: ['name'],
  filtersArr: Ember.computed.sort('filters.allfilters', 'sortAlpha'),

  /**
    Create model for filters collection

    @property buildFilters
    @type Class
  */
  buildFilters: function() {

    var currentContext = this.get('controller').get('model'),
        currentModel = currentContext.get('model'),
        library = currentModel.get('library'),
        cachedFilters = currentContext.get('cachedFilters');

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


    var libtags = [],
        allTags = _.uniq(library.getEach('tags'));
    allTags.filter(function(tags) {
      tags.filter(function(tag) {
        if (!_.contains(libtags, tag)) {
          libtags.push(tag);
        }
      });
    });

    //plain old array of filters
    var poarr = [
      //Price
      {
        name: 'Free', tag: 'free', group: 'availablity'
      },
      {
        name: 'Subscription', tag: 'subscription', group: 'availablity'
      },
      {
        name: 'Rent', tag: 'alacarte', group: 'availablity'
      },
      {
        name: 'Cable Provider', tag: 'cable provider', group: 'availablity'
      },
      {
        name: 'Cast-ready', tag: 'castready', group: 'availablity'
      },
      //Content
      {
        name: 'Full Episodes', tag: 'tv', group: 'content'
      },
      {
        name: 'Movies', tag: 'movies', group: 'content'
      },
      {
        name: 'Music', tag: 'music', group: 'content'
      },
      {
        name: 'Radio', tag: 'radio', group: 'content'
      },
      {
        name: 'P2P', tag: 'p2p', group: 'content'
      },

      //Genres
      {
        name: 'Kids', tag: 'kids', group: 'genres'
      },
      {
        name: 'Sports', tag: 'sports', group: 'genres'
      },
      {
        name: 'News', tag: 'news', group: 'genres'
      },
      {
        name: 'Fitness', tag: 'exercise', group: 'genres'
      },
      {
        name: 'Latino', tag: 'latino', group: 'genres'
      },
      {
        name: 'Documentaries', tag: 'documentaries', group: 'genres'
      },
      {
        name: 'Comedy', tag: 'comedy', group: 'genres'
      },
      {
        name: 'Drama', tag: 'drama', group: 'genres'
      },
      {
        name: 'SciFi / Fantasy', tag: 'scifi/fantasy', group: 'genres'
      },
      {
        name: 'Concerts', tag: 'concerts', group: 'genres'
      },
      {
        name: 'Horror', tag: 'horror', group: 'genres'
      },
      {
        name: 'Action/Adventure', tag: 'action/adventure', group: 'genres'
      },
      {
        name: 'Reality', tag: 'reality', group: 'genres'
      },
      {
        name: 'Animation', tag: 'animation', group: 'genres'
      },
      {
        name: 'DIY', tag: 'diy', group: 'genres'
      },
      {
        name: 'Food', tag: 'food', group: 'genres'
      },
      {
        name: 'Tech', tag: 'tech', group: 'genres'
      },
      {
        name: 'Premium', tag: 'premium', group: 'genres'
      },
      {
        name: 'Social', tag: 'social', group: 'genres'
      },
      {
        name: 'Independent', tag: 'independent', group: 'genres'
      }
    ];

    poarr.filter(function(item) {
      var a = FiltersModel.create();
      a.setProperties({
        name: item.name,
        on: false,
        tag: item.tag,
        group: item.group
      });
      if (_.contains(libtags, item.tag)) {
        _filters.get('allfilters').push(a);
      }
    });

    //if filters have already been cached, return cached filters
    if (!cachedFilters) {
      currentContext.set('cachedFilters', _filters);
      return _filters;
    } else {
      return cachedFilters;
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
        useFilters = this.get('filters.allfilters'),
        onFilters = useFilters.filterBy('on', true),
        shouldApplyFilters = [];

    //reset messaging
    this.set('error', false);
    this.set('message', null);

    //Isolate filters that are turn on into an array
    var sameGroup = _.uniq(onFilters.getEach('group')).length === 1;
    onFilters.filter(function(item) {
      shouldApplyFilters.push(item.tag);
    });

    //Iterate channels lib, toggle isfiltered property
    lib.setEach('isfiltered', true);
    lib.filter(function(item) {
      //todo: filter groups should be allowed to compound
      if (!sameGroup) {
        //show only channels with this combination of filters
        if (_.difference(shouldApplyFilters, item.tags).length === 0) {
          item.toggleProperty('isfiltered');
        }
      } else {
        //aggregate channels within this group
        shouldApplyFilters.filter(function(should) {
          if (_.contains(item.tags, should)) {
            item.set('isfiltered', false);
          }
        });
      }
    });

    var visibleLib = lib.filterBy('visible', true);
    if (visibleLib.isEvery('isfiltered')) {
      var controllerContext = this.get('controller').get('model');
      if (controllerContext.get('showFilterMessaging')) {
        this.set('error', true);
        this.set('message', this.messages.noMatch);
      }
    }
  },
  actions: {
    /**
      Designate filter on or off

      @method toggleFilter
    */
    toggleFilter: function(filter) {
      var filtersObj = this.get('filters'),
          currentFilter = filtersObj.get('allfilters'),
          foundFilter = currentFilter.findBy('name', filter);

      foundFilter.toggleProperty('on');
      this.applyFilters();
    },

    /**
      Designate entire filter group on or off

      @method toggleFilterGroup
    */
    toggleFiltersGroup: function(group) {
      var filtersGroup = this.get('filtersArr').filterBy('group', group),
          status = filtersGroup.isAny('on');

      filtersGroup.setEach('on', !status);

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
