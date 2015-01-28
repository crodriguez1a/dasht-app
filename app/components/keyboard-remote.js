import Ember from "ember";
import _ from "lodash";

/**
  Keyboard Remote component

  Remote control for key commands

  @class KeyboardRemoteComponent
*/
export default Ember.Component.extend({
  /**
  Mobile flag from device.js

  @property isMobile
  @type String
  */
  isMobile: function() {
    return window.__device.mobile;
  }.property(),
  /**
  Signal if user tried to click to interact with remote

  @property isClicked
  @type Bool
  @default False
  */
  clicked: false,
  /**
  Expand or collapse remote

  @property visible
  @type Bool
  */
  visible: false,
  /**
  Keep count of actionable elems

  @property actionItemCount
  @type Integer
  */
  actionItemCount: 0,
  /**
  Listen for keydown

  @method keyListener
  */
  keyListener: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      Ember.$(document).on('keydown', {self: this}, this.keyManager.bind(this));
    });
  }.on('didInsertElement'),
  /**
  Respond to key press events

  @method keyManager
  */
  keyManager: function(e) {
    var self = this,
        currentModel = self.get('model');

    //remove pressed status from all
    Ember.$('.keyboard-remote li').removeClass('pressed');

    //command k - toggle remote expand/collapsed
    if(e.keyCode === 75) {
      this.toggleProperty('visible');
    }

    //esc - collapse remote
    if(e.keyCode === 27) {
      this.set('visible', false);
    }

    //arrow keys
    var arrows = {
      left: 37,
      up: 38,
      right: 39,
      down: 40
    };

    if(_.contains(arrows, e.keyCode)){
      Ember.$('.kc-'+e.keyCode).addClass('pressed');

      var actionableItem = Ember.$('.actionable').not('.disabled'),
          curItem = this.get('actionItemCount');

      //stay in range
      if(curItem < 0 || curItem > actionableItem.length-1) {
        curItem = curItem < 0 ? 0 : actionableItem.length-1;
      }

      //tab forward/down
      if(e.keyCode === 39 || e.keyCode === 40) {
        actionableItem[curItem].focus();
        curItem++;
      }

      //tab back/up
      if(e.keyCode === 37 || e.keyCode === 38) {
        actionableItem[curItem].focus();
        curItem--;
      }
      //update actionItemCount
      this.set('actionItemCount', curItem);

      //prevent arrows from scrolling page
      e.preventDefault();
    }

    //enter key - Submit Action
    if(e.keyCode === 13) {
      Ember.$('.kc-'+e.keyCode).addClass('pressed');
    }

    //shift command O - Toggle Menu
    if(e.keyCode === 79 && e.shiftKey && e.metaKey) {
      Ember.$('.kc-'+e.keyCode).addClass('pressed');
      //To do: this focus is not working well yet
      Ember.$('nav').find('.actionable').focus();
      currentModel.sendAction('onToggleMenu');
    }

  },
  revertClick: function() {
    Ember.run.later(this, function() {
      this.set('clicked', false);
    }, 800);
  }.observes('clicked'),
  actions: {
    /**
    Expand or collapse remote

    @method toggleRemote
    */
    toggleRemote: function() {
      this.toggleProperty('visible');
    },
    /**
    If user tried to click, provide keyboard hint

    @property method
    */
    wasClicked: function() {
        this.toggleProperty('clicked');
    }
  }

});
