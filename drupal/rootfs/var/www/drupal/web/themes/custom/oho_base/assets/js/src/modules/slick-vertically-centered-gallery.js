/**
 * @file
 * JavaScript for the a vertically centered gallery
 *
 * @todo: Could use some cleanup & optimizations.
 */

export default function ohoVerticalGallery() {
  $('.photo-gallery__gallery').slick({
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    centerMode: true,
    variableWidth: true,
  });
}
