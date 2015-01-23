import Ember from "ember";

/**
* Places checkmark over active elem
*/
export default Ember.Handlebars.makeBoundHelper(function(checked) {
  if (!checked) {
    return new Ember.Handlebars.SafeString('<i class="fa fa-square-o"></i>');
  }else {
    return new Ember.Handlebars.SafeString('<i class="fa fa-check-square-o"></i>');
  }
});
