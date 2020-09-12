import { Node as Hast } from 'hast';
import { Table } from 'tdast-types';

export interface Options {
  /** use the `label` property of a tdast `Column` node for the text value of a hast thead node. */
  useColumnLabel?: boolean;
}

/**
 * Transforms tdast into a hast table node.
 */
export default function toHastTable(
  /** a valid tdast Table node */
  tdast: Table,
  /** configurable options */
  options?: Options,
): Hast;
