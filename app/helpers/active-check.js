import Ember from "ember";

/**
* Places checkmark over elem
*/
export default Ember.Handlebars.makeBoundHelper(function(item) {
  var compare = document.querySelector('html').dataset.theme;
  
  if (item && compare && item === compare) {
    return new Ember.Handlebars.SafeString('<i class="fa fa-check active-check"></i>');
  }
},'currentTheme');
