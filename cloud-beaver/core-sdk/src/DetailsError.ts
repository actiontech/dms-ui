export class DetailsError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'Error';
  }

  hasDetails(): boolean {
    return true;
  }
}
