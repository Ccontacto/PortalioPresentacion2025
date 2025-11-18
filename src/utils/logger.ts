const isDev = import.meta.env.DEV;

type LogMethod = (...args: unknown[]) => void;

const createLogger = (method: 'log' | 'warn' | 'error', enableInProd = false): LogMethod => {
  return (...args: unknown[]) => {
    if (!enableInProd && !isDev) {
      return;
    }
     
    console[method](...args);
  };
};

export const logger = {
  log: createLogger('log'),
  warn: createLogger('warn'),
  error: createLogger('error', true)
};
