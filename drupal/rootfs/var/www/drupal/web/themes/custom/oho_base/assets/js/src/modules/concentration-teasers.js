/**
 * @file
 * JavaScript for concentration teaser behaviors.
 *
 * @todo: Could use some cleanup & optimizations. Names seem strange...?
 */

export default function ohoConcentrationTeasers() {
  const $window = $(window);
  const $slick = $('.listing-slick');

  $window.on('load resize', () => {
    if (!$slick.hasClass('slick-initialized') && $window.width() < 1025) {
      $slick.slick({
        arrows: false,
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: 'auto',
        variableWidth: true,
        mobileFirst: true,
        responsive: [
          {
            breakpoint: 641,
            settings: {
              centerMode: false,
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 1024,
            settings: 'unslick',
          },
        ],
      });
    }
  });
}
