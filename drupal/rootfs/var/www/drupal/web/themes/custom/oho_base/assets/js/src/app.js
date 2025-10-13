/**
 * @file
 * JavaScript entrypoint file for the theme.
 *
 * All JavaScript added to the theme must go through this Webpack entrypoint.
 * Modules are included with import statements. Remove unused modules.
 * Import any module-specific CSS as well, and Webpack will bundle it in
 * /assets/dist/app.css. Module CSS paths are relative to the node_modules
 * folder, i.e. 'slick-carousel/slick/slick.css' for Slick's CSS.
 */

// Adjust as needed.
import './modules/accessible-menu';
import './modules/accordion';
import './modules/animation';
import './modules/button-toggle';
import './modules/counterup';
import ohoFancybox from './modules/fancybox';
import './modules/image-grid';
import './modules/jump-link';
import './modules/jump-nav';
import './modules/more-less';
import './modules/sidebar-navigation';
import './modules/slide-toggle';
import ohoStickyHeader from './modules/sticky-header';
import './modules/tabs';
import './modules/variable-scroll-to';

// Document ready.
// For Drupal builds, this will need to be replaced by a behavior.
$(() => {
  // Accessible menu.
  $('#main-menu, #audience-menu').ohoAccessibleMenu();

  // Accordions.
  $('.accordion').ohoAccordion();

  // Animations.
  $('.oho-animate-single').ohoAnimateSingle();
  $('.oho-animate-sequence').ohoAnimateSequence();

  // CounterUp.
  $('.count-up').ohoCounterUp();

  // Jump links.
  $('[href^="#"]:not([href="#"])').ohoJumpLink();

  // Jump nav.
  $('[data-jump-nav]').ohoJumpNav();

  // Fancybox.
  ohoFancybox();

  // Image grid.
  $('.image-grid').ohoImageGrid();

  // Mobile menu.
  $('.mobile-menu-button').ohoButtonToggle();

  // More or less.
  $('.more-less').ohoMoreLess();

  // Seach panel.
  $('.site-search__toggle').ohoButtonToggle();
  $('.site-search__toggle').on('toggle', (event, $button, state) => {
    if (state === 'open') {
      $button
        .next()
        .find('input')
        .focus();
    }
  });

  // Sidebar navigation.
  $('.sidebar-menu').ohoSidebarNavigation();

  // Slide toggle.
  $('.slide-toggle').ohoSlideToggle();

  // Sticky header.
  ohoStickyHeader();

  $('.tabs').ohoTabs();

  // Variable scroll to.
  $('[data-variable-scroll-button]').click(event => {
    const target = $(event.target).attr('data-variable-scroll-button');
    $(`[data-variable-scroll-target="${target}"]`).ohoVariableScrollTo();
  });

  // Add a class to <html> to style against if JavaScript did not execute.
  $('html').addClass('oho-js');
});
