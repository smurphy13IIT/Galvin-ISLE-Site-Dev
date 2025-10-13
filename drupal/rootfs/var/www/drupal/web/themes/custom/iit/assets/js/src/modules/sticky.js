// ----------------------------------------
// ------- STICKY HEADER FUNCTION
// ----------------------------------------
(function($) {
  var $lastScrollTop = 0;
  ohoSticky = function($stickyTarget, $stickyItem, mediaQueryValue, directionalScrollReveal="false") {
    var $stickyContainer = $($stickyTarget),
        $stickyHeaderItem = $stickyContainer.find($stickyItem),
        headerHeight = $stickyContainer.outerHeight(),
        stickyItemOuterHeight = $stickyHeaderItem.outerHeight(),
        headerMainOffsetTop = $stickyContainer.offset().top + headerHeight;

    if($stickyContainer.attr("data-directional-scroll-reveal")  === "true" || directionalScrollReveal === "true") {
      headerMainOffsetTop = headerMainOffsetTop + stickyItemOuterHeight;
      directionalScrollReveal = true;
    }

    enquire.register("screen and (min-width:"+mediaQueryValue+")", {

      match : function() {
        // -------------------------------------------------------
        // if we want to hide/show the header based on scroll direction
        // -------------------------------------------------------
        if(directionalScrollReveal) {
          // We are using the HTML attr in the CSS - if we're explicitly setting it to be true
          // we will make sure to add the ATTR to the HTML so we can use it
          if(!$stickyContainer.attr("data-directional-scroll-reveal") === "true" ) {
            $stickyContainer.attr("data-directional-scroll-reveal", "true");
          }
          var $st = $(window).scrollTop();
            if ($st > $lastScrollTop) {
              // downscroll code
              $stickyContainer.removeClass("sticky--scrolling-up");
            } else {
            // upscroll code
            $stickyContainer.addClass("sticky--scrolling-up");
            }
            $lastScrollTop = $st;
        }


        // -------------------------------------------------------
        // Conditions for when the $stickyHeaderItem should stick
        // -------------------------------------------------------

        if ($(window).scrollTop() > headerMainOffsetTop && !$stickyContainer.hasClass("sticky")) {
          $stickyContainer.addClass("sticky");
        } else if ($(window).scrollTop() < headerMainOffsetTop && $stickyContainer.hasClass("sticky")) {
          $stickyContainer.removeClass("sticky");
        }
        // -------------------------------------------------------
      },

      unmatch : function() {
        $stickyContainer.removeClass("sticky");
      },
    });
  };
  $(document).ready(function() {
    // ------- OHO STICKY INIT
    $("[data-sticky-container]").each(function() {
      var $this = $(this);
      ohoSticky($this, "[data-sticky-item]", "0");
      $(window).scroll(function() {
        ohoSticky($this, "[data-sticky-item]", "0");
      });
    });
  });
})(jQuery); // function