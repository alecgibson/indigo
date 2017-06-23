import * as uuidv4 from "uuid/v4";

export class Random {
  // Returns a random integer between two values, both inclusive
  public static integerInclusive(min = 0, max = 1): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(
      Math.random() * (max - min + 1)
    ) + min;
  }

  // Returns a random integer from min (inclusive) to max (exclusive)
  public static integerExclusive(min = 0, max = 1): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // Returns a random float from min (inclusive) to max (exclusive)
  public static float(min = 0, max = 1): number {
    return Math.random() * (max - min) + min;
  }

  public static uuid(): string {
    return uuidv4();
  }
}
