/**
 * @file
 * JavaScript to init repsonsive tables.
 *
 * @todo: Could use some cleanup & optimizations. Can this be combined with
 * responsive-tables.js?
 */

import 'footable';
import ohoResponsiveTables from './responsive-tables';

export default function ohoResponsiveTablesInit() {
  $('.footable').footable();
  ohoResponsiveTables();
}
