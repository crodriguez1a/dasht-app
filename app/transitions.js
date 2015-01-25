export default function() {

  var duration = 300;

  /* Page Transition */
  this.transition(
    this.fromRoute('index'),
    this.use('toLeft', { duration: duration }),
    this.reverse('toRight', { duration: duration })
  );

  /* Other Transitions */
  this.transition(
    this.hasClass('slide-down'),
    this.toModel(true),
    this.use('toDown', {duration: duration}),
    this.reverse('toUp', {duration: duration})
  );

  this.transition(
    this.hasClass('cross-fade'),
    this.toModel(true),
    this.use('crossFade', {duration: duration}),
    this.reverse('crossFade', {duration: duration})
  );

}
