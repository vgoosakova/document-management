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
