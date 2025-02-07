/**
 * Displays backend pagination typical interface.
 * T - type of the results.
 */
export interface BackendPagination<T> {
  /** The number of items matched the specific filters. */
  count: number;

  /** List of the results. */
  results: T;
}

/** Size of table page
 * May be used to display table with pagination.
 */
export const PAGINATION_PAGE_DEFAULT_SIZE = 10;
