/* eslint-disable prettier/prettier */
/**
 * @file
 * JavaScript entrypoint file for the theme.
 *
 * All JavaScript added to the theme must go through this Webpack entrypoint.
 * Modules are included with import statements. Remove unused modules.
 * Import any module-specific CSS as well, and Webpack will bundle it in
 * /assets/dist/app.css. Module CSS paths are relative to the node_modules
 * folder, i.e. '@glidejs/glide/dist/css/glide.core.css' for Glide's CSS.
 */

import './compat/ie11';
import Tooltip from 'tooltip.js';
import AccessibleMenu from './modules/accessible-menu';
import Accordion from './modules/accordion';
import {
  AnimateCount,
  AnimateSingle,
  AnimateSequence,
} from './modules/animation';
import ButtonToggle from './modules/button-toggle';
import ImageGrid from './modules/image-grid';
import JumpLink from './modules/jump-link';
import JumpNav from './modules/jump-nav';
import MoreOrLess from './modules/more-or-less';
import SidebarMenu from './modules/sidebar-menu';
import SlidingToggle from './modules/sliding-toggle';
import StickyHeader from './modules/sticky-header';
import Tab from './modules/tab';
import Table from './modules/table';

(() => {
  /**
   * Create iframe pass parameters behavior.
   * Add the data-pass-params boolean attribute to an iframe to rewrite
   * the iframe src url to include any parameters in the hosted page url.
   */
  Drupal.behaviors.iframePassParams = {
    attach(context, settings) {
      // eslint-disable-next-line no-undef
      once('iframePassParams', 'iframe[data-pass-params]', context).forEach(
        (element) => {
          const hostQueryString = window.location.search;
          if (hostQueryString !== '') {
            const hostUrlParams = new URLSearchParams(hostQueryString);
            const iframeURL = new URL(element.src);
            hostUrlParams.forEach((val, key) => {
              iframeURL.searchParams.set(key, val);
            });
            element.setAttribute('src', iframeURL.href);
          }
        }
      );
    }
  };

  /**
   * Add tooltip
   */
  Drupal.behaviors.tooltip = {
    attach(context, settings) {
      const tooltipItem = context.querySelectorAll('.popper');
      tooltipItem.forEach(item => {
        // eslint-disable-next-line no-new
        new Tooltip (item, {
          html: true,
        });
      });
    }
  };

  /**
   * Add the sticky header.
   */
  const stickyHeader = new StickyHeader(
    '.site-header',
    '.site-header__sticky-container',
    0,
  );
  stickyHeader.run();

  /**
   * Add the accessible menu.
   */
  const accessibleMenu = new AccessibleMenu();
  const headerMenus = document.querySelectorAll('#main-menu, #audience-menu');
  accessibleMenu.add(headerMenus).run();

  /**
   * Add the overview links to the menus.
   */
  // const menuOverviewLink = new MenuOverviewLink();
  // menuOverviewLink.add(headerMenus).run();

  /**
   * Mobile menu behavior.
   */
  const mobileToggle = new ButtonToggle();
  const mobileMenuButton = document.querySelectorAll('.mobile-menu-button');
  mobileToggle.add(mobileMenuButton).run();

  /**
   * Mobile Landing Page Menu.
   */
  const mobileLandingNavToggle = new ButtonToggle();
  const mobileLandingNavButton = document.querySelectorAll('.landing-nav__toggle');
  mobileLandingNavToggle.add(mobileLandingNavButton).run();

  /**
   * Search panel behavior.
   */
  const searchToggle = new ButtonToggle();
  const searchButton = document.querySelectorAll('.site-search__toggle');
  searchToggle.add(searchButton).run();
  searchToggle.on('toggle', click => {
    if (click.clicked) {
      click.event.target.nextElementSibling.querySelector('input').focus();
    }
  });

  /**
   * Add the sidebar menu behavior.
   */
  const sidebarMenu = new SidebarMenu();
  const sidebarMenuElement = document.querySelectorAll('.sidebar-menu');
  sidebarMenu.add(sidebarMenuElement).run();

  /**
   * Create standard accordions.
   */
  Drupal.behaviors.accordion = {
    attach(context, settings) {
      const accordion = new Accordion();
      // eslint-disable-next-line no-undef
      once('accordions-once-id', '.accordion', context).forEach((el) => {
        accordion.add(el);
      });
      accordion.run();
    }
  };

  /**
   * Create Program compare mobile accordion -- not used
   */
  // const programCompareAccordion = new Accordion();
  // const programCompareAccordionElements = document.querySelectorAll('.program-compare-accordion');
  // programCompareAccordion.add(programCompareAccordionElements).run();

  /**
   * Create standard image grids.
   */
  const imageGrid = new ImageGrid();
  const imageGridElements = document.querySelectorAll('.image-grid');
  imageGrid.add(imageGridElements).run();

  /**
   * Create jump link scrolling.
   */
  const jumpLinks = new JumpLink();
  const jumpLinkElements = document.querySelectorAll(
    '[href^="#"]:not([href="#"]):not(.program-list-tab)',
  );
  jumpLinks.add(jumpLinkElements).run();

  /**
   * Create the jump nav.
   */
  new JumpNav().create('.jump-nav');

  /**
   * Add standard animations.
   */
  const singleAnimation = new AnimateSingle();
  const singleAnimationElements = document.querySelectorAll(
    '.oho-animate-single',
  );
  singleAnimation.add(singleAnimationElements).run();
  const sequenceAnimation = new AnimateSequence();
  const sequenceAnimationElements = document.querySelectorAll(
    '.oho-animate-sequence',
  );
  sequenceAnimation.add(sequenceAnimationElements).run();
  const countAnimation = new AnimateCount();
  const countAnimationElements = document.querySelectorAll(
    '.oho-animate-count',
  );
  countAnimation.add(countAnimationElements).run();

  /**
   * Create standard more or less.
   */
  const moreOrLess = new MoreOrLess();
  const moreOrLessElements = document.querySelectorAll('.more-less');
  moreOrLess.add(moreOrLessElements).run();

  /**
   * Create standard sliding toggles.
   */
  const slidingToggle = new SlidingToggle();
  const slidingToggleElements = document.querySelectorAll('.slide-toggle');
  slidingToggle.add(slidingToggleElements).run();

  /**
   * Create standard tabs.
   */
  const tabs = new Tab();
  const tabElements = document.querySelectorAll('.tabs');
  tabs.add(tabElements).run();

  /**
   * Wrap tables for responsive styles.
   */
  const tables = new Table();
  const tableElements = document.querySelectorAll('#main-content table');
  tables.add(tableElements).run();

  // eslint-disable-next-line func-names
  $(document).ready(function() {
    /**
     * Add Homepage Tabs
     *
     */
    if ($("#tabs").length) {
      $("#tabs").tabs();
    }

    /**
     * We need a class on the ohou media module div above the video
     *
     */
    $('.video-embed-field-responsive-video').parent("div").addClass("media-embed--video js-processed").parent("div, .embedded-entity").addClass("media-embed--video js-processed");

    /**
     * Add the profile slider
     */
    $(".grid-container--profile-slider .slick-init").slick({
      arrows: true,
      centerMode: false,
      dots: false,
      infinite: true,
      mobileFirst: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      variableWidth: true,
      appendArrows: ".grid-container--profile-slider .controls",
      prevArrow: '<button class="slider__arrow slider__arrow--prev glide__arrow glide__arrow--prev" data-glide-dir="<"><span class="show-for-sr">See Previos Profile</span></button>',
      nextArrow: '<button class="slider__arrow slider__arrow--prev glide__arrow glide__arrow--next" data-glide-dir="<"><span class="show-for-sr">See Next Profile</span></button>',
      responsive: [
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 2,
            infinite: false,
          }
        },
        {
          breakpoint: 850,
          settings: {
            infinite: false,
            slidesToShow: 3,
          }
        }
      ]
    });

    /**
     * Add the Outcomes Slider
     */
    $('.outcomes-slider--primary').slick({
      centerMode: true,
      variableWidth: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      prevArrow: '<button class="slider__arrow slider__arrow--prev glide__arrow glide__arrow--prev" data-glide-dir="<"> <span class="show-for-sr">See Previous Outcome</span></button>',
      nextArrow: '<button class="slider__arrow slider__arrow--next glide__arrow glide__arrow--next" data-glide-dir=">"><span class="show-for-sr">See Next Outcome</span></button>',
      mobileFirst: true,
      responsive: [
        {
          breakpoint: 641,
          settings: {
            slidesToShow: 2,
            centerMode: false,
            draggable: false,
            swipeToSlide: false,
            asNavFor: '.outcomes-slider--content, .outcomes-slider--images',
          },
        },
        {
          breakpoint: 851,
          settings: {
            slidesToShow: 1,
            centerMode: false,
            asNavFor: '.outcomes-slider--content, .outcomes-slider--images',
          },
        },
        {
          breakpoint: 1025,
          settings: {
            asNavFor: '.outcomes-slider--content, .outcomes-slider--images',
            centerMode: true,
          },
        }
      ],
    });
    $('.outcomes-slider--content').slick({
      centerMode: true,
      variableWidth: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      asNavFor: '.outcomes-slider--images, .outcomes-slider--primary',
      draggable: false,
      swipeToSlide: false,
      responsive: [
        {
          breakpoint: 640,
          settings: {
            unslick: true,
          }
        }
      ],
    });

    // add first slide to the end to synthesize the
    // effect that image is going from one slider to the next
    $(".outcomes-slider--images .featured-person:first-child").appendTo(".outcomes-slider--images");

    $('.outcomes-slider--images').slick({
      centerMode: false,
      variableWidth: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      asNavFor: '.outcomes-slider--content, .outcomes-slider--primary',
      draggable: false,
      swipeToSlide: false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            unslick: true,
          }
        }
      ]
    });
  });

  /**
   * Add the testimonial slider
   */
  // eslint-disable-next-line prettier/prettier
  if (document.querySelectorAll('.slideshow-container .testimonial-item').length > 1) {
    $('.slideshow-container__slides').slick({
      centerMode: true,
      variableWidth: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      draggable: true,
      swipeToSlide: true,
      arrows: true,
    });
  }

  /**
   * Add a class to the body to style against if this JavaScript did not load
   * correctly or has an error which blocks JavaScript execution.
   */
  document.querySelector('html').classList.add('oho-js');
})();
