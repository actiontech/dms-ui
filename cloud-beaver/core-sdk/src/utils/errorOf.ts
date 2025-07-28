export function errorOf<T extends abstract new (...args: any) => Error>(
  error: any,
  constructor: T
): InstanceType<T> | undefined {
  if (error instanceof constructor) {
    return error as InstanceType<T>;
  }

  while (error) {
    if (error instanceof constructor) {
      return error as InstanceType<T>;
    }
    if (error instanceof Error) {
      error = error.cause;
    } else {
      return undefined;
    }
  }
  return undefined;
}
