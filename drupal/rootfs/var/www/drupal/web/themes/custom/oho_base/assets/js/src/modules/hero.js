/**
 * @file
 * JavaScript for hero behaviors.
 *
 * @todo: Could use some cleanup & optimizations.
 */

export default function ohoHero() {
  // Establish parallax for both the video
  // and messaging components to create some depth.
  const parallaxScroll = () => {
    const scrolled = $(window).scrollTop();
    $('.hero--parallax img, .hero--parallax video, .hero--parallax iframe').css(
      'top',
      `${-1 - scrolled * 0.09}px`,
    );
  };
  // We add autoplay if touch is disabled (Safest way to assume an internet connection)
  // --- additionally Safari does not support autoplay on any touch device
  if ($('.hero--video').length && !$('.touchevents').length) {
    $('.hero video').attr('autoplay', '');
  }

  if (!$('.has-alert, .touchevents').length) {
    if ($('.hero--parallax').length) {
      // Establish parallax for both the video & Images
      $(window).bind('scroll', parallaxScroll);
    }
  }
  if ($('#bgndVideo').length) {
    $('#bgndVideo').YTPlayer();

    // setting the video to 'body' is the only way to toggle its parallax behavior
    // This makes it a direct child of the <body> and we still want it in its hero container
    $('#wrapper_bgndVideo').appendTo('.video-feature');
  }
}
