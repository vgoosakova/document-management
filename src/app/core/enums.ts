/**
 * List of the main application routes.
 */
export enum routerLinks {
  auth = 'auth',

  login = 'login',

  register = 'register',

  dashboard = 'dashboard',
}

/**
 * Progress statuses for any async operations, like loading, calculations, etc.
 * May be used to display load state without creating a lot of variables.
 */
export enum progressStatuses {
  /** Display that process were not started yet. */
  notInitialized = 'not_initialized',

  /** Display that process started, but not finished yet. */
  inProgress = 'in_progress',

  /** Display that process started, and finished successfully. */
  succeed = 'finished',

  /** Display that process started, but were interrupted by unexpected error. */
  interrupted = 'interrupted',
}
