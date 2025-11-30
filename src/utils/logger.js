/**
 * Frontend Development Logger
 * 
 * Provides structured logging for development and debugging.
 * Only logs in development mode unless explicitly forced.
 * 
 * @example
 * import { createLogger } from '@/utils/logger';
 * const logger = createLogger('ComponentName');
 * logger.debug('Rendering with props', { props });
 * logger.action('Button clicked', { id: 123 });
 */

const isDev = import.meta.env.DEV;
const isDebug = import.meta.env.VITE_DEBUG === 'true';

const styles = {
  debug: 'color: #6b7280; font-weight: normal;',
  info: 'color: #3b82f6; font-weight: normal;',
  warn: 'color: #f59e0b; font-weight: bold;',
  error: 'color: #ef4444; font-weight: bold;',
  success: 'color: #10b981; font-weight: bold;',
  action: 'color: #8b5cf6; font-weight: bold;',
  api: 'color: #06b6d4; font-weight: bold;',
  render: 'color: #f97316; font-weight: normal;',
};

const icons = {
  debug: '🔍',
  info: 'ℹ️',
  warn: '⚠️',
  error: '❌',
  success: '✅',
  action: '🎯',
  api: '🌐',
  render: '🎨',
};

/**
 * Format timestamp for logs
 */
const getTimestamp = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(now.getMilliseconds()).padStart(3, '0');
};

/**
 * Create a logger instance for a specific module/component
 * @param {string} moduleName - Name for identification in logs
 * @returns {Object} Logger with various log level methods
 */
export const createLogger = (moduleName) => {
  const log = (level, message, data = null, force = false) => {
    if (!isDev && !force && !isDebug) return;

    const timestamp = getTimestamp();
    const icon = icons[level] || '📝';
    const style = styles[level] || '';

    const prefix = `${icon} [${timestamp}] [${moduleName}]`;

    if (data !== null && data !== undefined) {
      console.log(`%c${prefix} ${message}`, style, data);
    } else {
      console.log(`%c${prefix} ${message}`, style);
    }
  };

  return {
    /**
     * Debug level - verbose debugging info
     */
    debug: (message, data) => log('debug', message, data),

    /**
     * Info level - general information
     */
    info: (message, data) => log('info', message, data),

    /**
     * Warn level - warnings
     */
    warn: (message, data) => log('warn', message, data),

    /**
     * Error level - errors (always logged in dev)
     */
    error: (message, data) => log('error', message, data, true),

    /**
     * Success level - successful operations
     */
    success: (message, data) => log('success', message, data),

    /**
     * Action level - user actions/events
     */
    action: (message, data) => log('action', message, data),

    /**
     * API level - API calls and responses
     */
    api: (message, data) => log('api', message, data),

    /**
     * Render level - component renders
     */
    render: (message, data) => log('render', message, data),

    /**
     * Log component mount
     */
    mount: (props = null) => {
      log('render', 'Component mounted', props);
    },

    /**
     * Log component unmount
     */
    unmount: () => {
      log('render', 'Component unmounted');
    },

    /**
     * Log state change
     */
    state: (stateName, newValue, oldValue = undefined) => {
      if (oldValue !== undefined) {
        log('debug', `State "${stateName}" changed`, { from: oldValue, to: newValue });
      } else {
        log('debug', `State "${stateName}" set`, { value: newValue });
      }
    },

    /**
     * Log Redux action dispatch
     */
    dispatch: (actionType, payload = null) => {
      log('action', `Dispatching: ${actionType}`, payload);
    },

    /**
     * Log form submission
     */
    form: (formName, data) => {
      log('action', `Form "${formName}" submitted`, data);
    },

    /**
     * Log validation errors
     */
    validation: (errors) => {
      log('warn', 'Validation errors', errors);
    },

    /**
     * Time an async operation
     */
    time: async (label, asyncFn) => {
      const start = performance.now();
      try {
        const result = await asyncFn();
        const duration = (performance.now() - start).toFixed(2);
        log('debug', `${label} completed in ${duration}ms`);
        return result;
      } catch (error) {
        const duration = (performance.now() - start).toFixed(2);
        log('error', `${label} failed after ${duration}ms`, { error: error.message });
        throw error;
      }
    },

    /**
     * Create a child logger with nested context
     */
    child: (childName) => createLogger(`${moduleName}/${childName}`),
  };
};

/**
 * Pre-configured loggers for common modules
 */
export const loggers = {
  admin: createLogger('Admin'),
  auth: createLogger('Auth'),
  api: createLogger('API'),
  form: createLogger('Form'),
  redux: createLogger('Redux'),
};

export default createLogger;
