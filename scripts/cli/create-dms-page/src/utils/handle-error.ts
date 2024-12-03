import { logger } from './logger';

export function handleError(error: unknown) {
  if (typeof error === 'string') {
    logger.error(error);
  }

  if (error instanceof Error) {
    logger.error(error.message);
  }

  logger.error('Something went wrong. Please try again.');
  process.exit(1);
}
