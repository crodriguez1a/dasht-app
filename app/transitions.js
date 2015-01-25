var duration = 300;
var options = { duration: duration };

export default function() {

  /* Page Transition */
  this.transition(
    this.fromRoute('index'),
    this.use('toLeft', options),
    this.reverse('toRight', options)
  );

  /* Other Transitions */
  this.transition(
    this.hasClass('slide-down'),
    this.toModel(true),
    this.use('toDown', options),
    this.reverse('toUp', options)
  );

  this.transition(
    this.hasClass('cross-fade'),
    this.toModel(true),
    this.use('crossFade', options),
    this.reverse('crossFade', options)
  );

}
