export class Arrays {
  // https://stackoverflow.com/a/37319954/4003671
  public static filterInPlace(array, condition) {
    let j = 0;
    let squeezing = false;

    array.forEach((element, index) => {
      if (condition.call(element, index, array)) {
        if (squeezing) {
          array[j] = element;
        }
        j++;
      } else {
        squeezing = true;
      }
    });

    array.length = j;
    return array;
  }
}
