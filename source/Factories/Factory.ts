export default abstract class Factory<T> {

  public build(overrideFunction?: Override<T>): T {
    const instance = this.base();

    if (overrideFunction) {
      overrideFunction(instance);
    }

    return instance;
  }
  protected abstract base(): T;
}

type Override<T> = (instance: T) => void;
