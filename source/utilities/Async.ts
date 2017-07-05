export class Async {
  public static do(makeGenerator) {
    let generator = makeGenerator.apply(this, arguments);

    try {
      return handle(generator.next());
    } catch (error) {
      return Promise.reject(error);
    }

    function handle(result) {
      if (result.done) {
        return Promise.resolve(result.value);
      }

      return Promise.resolve(result.value)
        .then(nextResult => {
          return handle(generator.next(nextResult));
        })
        .catch(error => {
          return handle(generator.throw(error));
        });
    }
  }

  public static test(makeGenerator) {
    return Async.do(makeGenerator).catch(e => console.log(e));
  }
}
