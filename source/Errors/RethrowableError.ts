export default abstract class RethrowableError extends Error {
  public constructor(error?: string | Error) {
    const message = error instanceof Error ? error.message : error;
    super(message);

    this.name = this.constructor.name;

    if (error instanceof Error) {
      this.stack = error.stack;
    }
  }
}
