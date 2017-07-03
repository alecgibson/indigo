export class Serializable {
  public static deepClone(object) {
    let serialized = JSON.stringify(object);
    return JSON.parse(serialized);
  }
}
