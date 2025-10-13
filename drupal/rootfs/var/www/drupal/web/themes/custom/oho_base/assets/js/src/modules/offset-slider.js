/**
 * @file
 * JavaScript for the offset slider.
 *
 * @todo: Could use some cleanup & optimizations.
 */

$.fn.ohoThreeOffsetSlider = function ohoThreeOffsetSlider() {
  this.slick({
    arrows: false,
    centerMode: true,
    centerPadding: 'auto',
    dots: false,
    infinite: false,
    mobileFirst: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 640,
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
};

// The unlimited offset calling function
$.fn.ohoUnlimiteOffsetSlider = function ohoUnlimiteOffsetSlider() {
  this.slick({
    arrows: false,
    centerMode: true,
    centerPadding: 'auto',
    dots: false,
    infinite: false,
    mobileFirst: true,
    slidesToScroll: 1,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          centerMode: false,
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          centerMode: false,
          slidesToShow: 3,
        },
      },
    ],
  });
};
