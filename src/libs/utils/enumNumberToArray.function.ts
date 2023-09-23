const isNumberString = (value: unknown) => isNaN(Number(value)) === true;

// Turn enum into array
export function EnumToArray(_enum) {
  return Object.keys(_enum)
    .filter(isNumberString)
    .map((key) => _enum[key]);
}
