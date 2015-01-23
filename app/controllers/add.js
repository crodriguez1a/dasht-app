import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['index','application'],
  error: false,
  filtering: false,
  message: null,
  messages: {
    noEntry: "Nothing to find.",
    noMatch: "Sorry. We couldn't find that channel.",
    serviceDown: "Oops. The service is down temporarily. Please try back in a few minutes.",
    noUrl: "Hmm, try searching for a url instead ('ie: pbs<b>.org</b>').",
    prevInstalled: "Yep, that's already been added.",
    successInstalled: "Successfully added."
  },
  messageOut: function() {
    Ember.run.later(this, function() {
      this.set('message', null);
    }, 1500);
  }.observes('message'),
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
          return this.set('message', 'temp: adding channel');
        }
      }


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
