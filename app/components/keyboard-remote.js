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
      Ember.$(document).on('keydown', { self: this }, this.keyManager.bind(this));
    });
  }.on('didInsertElement'),
  /**
  Listen for remote open/close

  @method remoteListener
  */
  remoteListener: function() {
    var actionableItem = Ember.$('.actionable').not('.disabled'),
        curItem = this.get('actionItemCount');

    if (this.get('visible')) {
      actionableItem[curItem].focus();
    } else {
      actionableItem[curItem].blur();
    }

  }.observes('visible'),
  /**
  Respond to key press events

  @method keyManager
  */
  keyManager: function(e) {

    var self = this,
        currentModel = self.get('model'),
        actionableItems = Ember.$('.actionable').not('.disabled'),
        curItem = this.get('actionItemCount');

    //remove pressed status from all remote control keys
    Ember.$('.keyboard-remote li').removeClass('pressed');

    //open remote if user uses arrows or any other trigger designated
    var hotKeys = [37, 38, 39, 40];
    if (_.contains(hotKeys, e.keyCode)) {
      if (!this.get('visible')) {
        this.set('visible', true);
      }
      //prevent arrows from scrolling page
      e.preventDefault();
    }

    //command k - toggle remote expand/collapsed
    if (e.keyCode === 75 && e.metaKey) {
      this.toggleProperty('visible');
    }

    //esc - collapse remote
    if (e.keyCode === 27) {
      this.set('visible', false);
    }

    //arrow keys
    var arrows = {
      left: 37,
      up: 38,
      right: 39,
      down: 40
    };

    if (_.contains(arrows, e.keyCode)) {

      //hightlight button on remote
      Ember.$('.kc-'+e.keyCode).addClass('pressed');

      //tab forward
      if (e.keyCode === 39) {
        curItem++;
      }

      //tab back
      if (e.keyCode === 37) {
        curItem--;
      }

      //define tabable grids
      var grid = Ember.$(actionableItems[curItem]).closest('.grid'),
          gridRow = Math.floor(grid.innerWidth() / Ember.$(actionableItems[curItem]).innerWidth());

      //tab up/down
      if (e.keyCode === 38 || e.keyCode === 40 ) {
        if (gridRow > 3) {
        //account for channels margin
        gridRow = Ember.$(actionableItems[curItem]).parent().hasClass('channel') ? gridRow-1 : gridRow;
        //skip down to next row
        curItem = e.keyCode === 40 ? curItem+gridRow : curItem-gridRow;
        } else {
          //native tabbing
          if (e.keyCode === 40) {
            curItem++;
          } else {
            curItem--;
          }
        }
      }

      if (curItem > -1 && curItem < actionableItems.length) {
        //update actionItemCount
        this.set('actionItemCount', curItem);
        //focus on current item
        return actionableItems[curItem].focus();
      } else {
        var prevGrid = grid.prev('.grid'),
            nextGrid = grid.next('.grid');

        //reached top of grid
        if(e.keyCode === 38 && prevGrid.length > 0) {
          var prevActionable = prevGrid.find('.actionable').last();
          this.set('actionItemCount', _.indexOf(actionableItems, prevActionable[0]));
          return prevActionable.focus();
        }

        //reached bottom of grid
        if(e.keyCode === 40 && nextGrid.length > 0) {
          var nextActionable = prevGrid.find('.actionable').first();
          this.set('actionItemCount', _.indexOf(actionableItems, nextActionable[0]));
          return nextActionable.focus();
        }
      }

    }

    //enter key - Submit Action
    if (e.keyCode === 13) {
      Ember.$('.kc-'+e.keyCode).addClass('pressed');
    }

    //shift command O - Toggle Menu
    if (e.keyCode === 79 && e.shiftKey && e.metaKey) {
      Ember.$('.kc-'+e.keyCode).addClass('pressed');
      currentModel.sendAction('onToggleMenu');
      this.set('actionItemCount', 0);
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
