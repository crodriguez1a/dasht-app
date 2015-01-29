import Ember from "ember";

/**
* Simulates checkbox input
*/

export default Ember.Handlebars.makeBoundHelper(function(checked) {
  if (!checked) {
    return new Ember.Handlebars.SafeString('<i class="fa fa-square-o"></i>');
  } else {
    return new Ember.Handlebars.SafeString('<i class="fa fa-check-square-o"></i>');
  }
});
