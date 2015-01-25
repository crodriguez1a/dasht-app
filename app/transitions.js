export default function() {

  var duration = 300;

  /* Page Transition */
  this.transition(
    this.fromRoute('index'),
    this.use('toLeft', { duration: duration }),
    this.reverse('toRight', { duration: duration })
  );

  /* Menu Transition */
  this.transition(
    this.hasClass('nav-menu-wrapper'),
    this.toModel(true),
    this.use('toLeft', { duration: duration }),
    this.reverse('toRight', { duration: duration })
  );

  /* SubMenu Transition */
  this.transition(
    this.hasClass('slide-down'),
    // this makes our rule apply when the liquid-if transitions to the
    // true state.
    this.toModel(true),
    this.use('toDown', {duration: duration}),
    // which means we can also apply a reverse rule for transitions to
    // the false state.
    this.reverse('toUp', {duration: duration})
  );

}
