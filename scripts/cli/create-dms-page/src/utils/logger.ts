import chalk from 'chalk';

function stringify(arg: unknown): string {
  if (typeof arg === 'string') {
    return arg;
  } else if (arg === null) {
    return 'null';
  } else if (arg === undefined) {
    return 'undefined';
  } else if (typeof arg === 'object') {
    try {
      return JSON.stringify(arg, null, 2);
    } catch {
      return '[Circular]';
    }
  } else {
    return String(arg);
  }
}

function createLogFunction(chalkColor: chalk.Chalk) {
  return (...args: unknown[]) => {
    const message = args.map(stringify).join(' ');
    console.log(chalkColor(message));
  };
}

export const logger = {
  error: createLogFunction(chalk.red),
  warn: createLogFunction(chalk.yellow),
  info: createLogFunction(chalk.cyan),
  success: createLogFunction(chalk.green),
  break() {
    console.log('');
  }
};

export const verboseLogger = (show = false) => {
  const createConditionalLogFunction = (chalkColor: chalk.Chalk) => {
    return (...args: unknown[]) => {
      if (show) {
        createLogFunction(chalkColor)(...args);
      }
    };
  };

  return {
    error: createConditionalLogFunction(chalk.red),
    warn: createConditionalLogFunction(chalk.yellow),
    info: createConditionalLogFunction(chalk.cyan),
    success: createConditionalLogFunction(chalk.green)
  };
};
