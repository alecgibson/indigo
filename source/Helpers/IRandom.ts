export default interface IRandom {
  float(lowerBound: number, upperBound: number): number;
  integer(lowerBound: number, upperBound: number): number;
}
