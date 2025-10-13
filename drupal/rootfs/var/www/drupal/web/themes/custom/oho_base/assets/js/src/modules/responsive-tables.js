/**
 * @file
 * JavaScript for the responsive tables.
 *
 * @todo: Could use some cleanup & optimizations. Can this be combined with
 * responsive-table-init.js?
 */

export default function ohoResponsiveTables() {
  // Reset the table width to
  // To be more responsive friendly
  if ($('table').length) {
    $('table:not(.gsc-search-box):not(.gsc-search-box table)').each(
      (tableIndex, tableElement) => {
        const $this = $(tableElement);
        const $tableWidth = $this.css('width');

        if (!$this.hasClass('js-processed')) {
          $this.addClass('footable table js-processed breakpoint-lg');
          $this
            .find('thead th:not(:first-child)')
            .attr('data-breakpoints', 'xs ');
        }

        // intercept WYSIWYG inline style and set it as max width so it is flexible
        $this.css({
          width: '100%',
          'max-width': $tableWidth,
        });
      },
    );
  }
}
