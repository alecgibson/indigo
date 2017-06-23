export class Random {
  // Returns a random integer between two values, both inclusive
  public static integer(min = 0, max = 1): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(
      Math.random() * (max - min + 1)
    ) + min;
  }

  // Returns a random float from min (inclusive) to max (exclusive)
  public static float(min = 0, max = 1): number {
    return Math.random() * (max - min) + min;
  }
}
