import Ember from "ember";

/**
* Places checkmark over active elem
*/
export default Ember.Handlebars.makeBoundHelper(function(item, compare) {
  if (item === compare) {
    return new Ember.Handlebars.SafeString('<i class="fa fa-check active-check"></i>');
  }
});
