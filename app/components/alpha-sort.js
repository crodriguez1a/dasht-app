import Ember from 'ember';

/**
  Alpha Sort component

  Alphabetical sort (iOS style)

  @class AlphaSortComponent
*/
export default Ember.Component.extend({
  alphabet: Ember.Object.create({
    letters: null
  }),
  filterByModel: function() {
    var currentContext = this.get('model'),
        currentModel = currentContext.get('model'),
        channelsLib = currentModel.get('library'),
        alpha = [];

    channelsLib = channelsLib.sortBy('title');
    channelsLib.filter(function(item){
      alpha.push(item.get('title')[0].toLowerCase());
    });

    this.get('alphabet').set('letters', alpha.uniq());

  }.on('init')
});
