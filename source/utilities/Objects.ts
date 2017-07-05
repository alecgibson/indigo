export class Objects {
  public static values(object): any[] {
    return Object.keys(object).map(key => object[key]);
  }

  public static group(objects, groupingKey): any[] {
    return objects.reduce((grouped, object) => {
      grouped[object[groupingKey]] = object;
      return grouped;
    }, {})
  }
}
