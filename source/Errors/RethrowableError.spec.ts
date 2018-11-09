import RethrowableError from './RethrowableError';
import { expect } from 'chai';

describe('RethrowableError', () => {
  class TestError extends RethrowableError { }

  it('rewraps an error and preserves the stack', () => {
    try {
      try {
        boom();
      } catch (originalError) {
        throw new TestError(originalError);
      }
    } catch (rethrownError) {
      expect(rethrownError.name).to.equal('TestError');
      expect(rethrownError.message).to.equal('BOOM');
      expect(rethrownError.stack).to.match(/Error: BOOM\s+at boom/);
    }

    function boom() {
      throw new Error('BOOM');
    }
  });

  it('can be called without an argument', () => {
    const error = new TestError();
    expect(error).to.be.ok;
  });
});
