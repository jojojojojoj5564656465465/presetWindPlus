import UnitArray from "./Class/Units";
import * as v from "valibot"
const schemaArray = v.pipe(v.array(v.string()),v.maxLength(4),v.minLength(1))

/**
 * Removes duplicates in margin or padding values to avoid repetition in CSS output.
 *
 * @param {string[]} array - An array of margin or padding values (e.g. "2px 2px 2px
2px").
 * @returns {string[]} The input array with duplicates removed.
 *
 * @example
 * const originalArray = ["2px", "2px", "2px", "2px"];
 * const resultArray = removeDuplicateArrayPaddingOrMargin(originalArray);
 * console.log(resultArray); // Output: ["2px"]
 */
export function removeDuplicateArrayPaddingOrMargin(
  array: Array<string>
): Array<string> {
  switch (array.length) {
    case 2:
      if (array[0] === array[1]) array.pop();

      if (new Set(array).size === 1) array.splice(1, 2);

      break;
    case 3:
      if (array[1] === array[2]) array.pop();

      if (new Set(array).size === 1) array.splice(1, 3);

      break;
    case 4:
      if (array[0] === array[2]) {
        if (array[1] === array[3]) array.splice(3, 1);

        array.splice(2, 1);
      }
      if (new Set(array).size === 1) array.splice(1, 3);

      break;
    default:
      // No duplicates to remove
      break;
  }
  return array;
}

/**
 * @description take all units from regex and convert it USE CLASS UnitArray
 * @param array [ '4', '[15px]', '5', 'max' ]
 * @returns [ '1rem', '15px', '1.25rem', 'max-content' ]
 * @deprecated
 */
export function convertUnitFromArray(array: string[]): string[] {
  for (let index = 0; index < array.length; index++) {
    try {
      const e = array[index];
      if (e === undefined)
        throw new Error("array convertUnitFromArray is undefined");
      const element = new UnitArray(e);
      element.numberRemOrString();
      array.splice(index, 1, element.el);
    } catch (error) {
      console.error("convertUnitFromArray error: ", error);
    }
  }
  return array.filter(Boolean);
}

/**
 * @description assertion Function for Typescript
 * @param input unknown type
 * @param msg error message in case there is undefined
 */
export function eliminerUndefined<T>(
  input: unknown,
  msg?: string
): asserts input is T {
  if (input === undefined) console.error(msg ?? "Value is undefined 🫎🫎");

  if (input === null) console.error(msg ?? "Value is null 🫎🫎");
}

/**
 *@description avoid undefined in regex TS issues
 * @param match what come from the function as match
 * @param x which group are you looking for
 * @returns string without undefined
 */
export function matchFromRegex<T = string>(match: RegExpMatchArray, x: string) {
  const result = match.groups?.[x];
  if (result === undefined) {
    throw new Error(
      "the groups you provide is undefined in the Regex matchFromRegex",
      { cause: result }
    );
  }
  removeDirectionInArray(match);
  return result as T;
}

/**
 * @description remove direction in array match A
 * @param {RegExpMatchArray} array come from Match
 */
function removeDirectionInArray(array: RegExpMatchArray): void {
  array.splice(1, 1);
}
type NoInfer<T> = {
  [K in keyof T]: T extends T ? never : T;
};


export function elementFromDictionary<T extends Record<string, string>>(
  obj: T,
  key: keyof NoInfer<T>
): T[keyof T] {
  eliminerUndefined(key, "key is undefined");
  if (key in obj) {
    return obj[key];
  }
  throw new Error("elementFromDictionary is undefined");
}

/**
 * 
 * @param x Match from regex
 * @returns string[] '5', '6', '9' only the units 
 * @description match Array(6) [
  'p-5-6-9', 'p', '5', '6', '9', undefined, index: 0, input: 'p-5-6-9', groups: { direction: 'p', one: '5', four: undefined }]

 */
  export const matchUnitsNonProcessed = (x: unknown[])=>x?.filter(Boolean).filter(String) as string[];



  const a = /^(p|m)/.source;
const dig = '(?<=-)(\\bfull\\b|\\bscreen\\b|\\bmin\\b|\\bmax\\b|\\bfit\\b|\\bfill\\b|\\bauto\\b|\\bdvw\\b|\\bdvh\\b|\\bsvw\\b|\\bsvh\\b|\\blvw\\b|\\blvh\\b|\\bpx\\b|\\d+\\.?\\/?[1-9]?|\\[\\d+.?(?:\\w+|%)\\])'

let enutilisant = /^(p|m)(?:-?\d{1,4}){4}/g
const arrr = `${a}${dig}${dig}?${dig}?-?${dig}`;



export const dynamicRegex = new RegExp(arrr);




const regexOptions = {
  words:
    /\bfull\b|\bscreen\b|\bmin\b|\bmax\b|\bfit\b|\bfill\b|\bauto\b|\bdvw\b|\bdvh\b|\bsvw\b|\bsvh\b|\blvw\b|\blvh\b|\bpx\b/,
  numberOnly: /\d+(?:\.5)?(?!\w)/,
  franction: /[1-9]\/[2-9]/,
  squareBrackets: /\[[1-9]\d*.?\d?(?:\w+|%)\]/,
};

export const regexUnit = `(?<!--)${regexOptions.franction.source}|${regexOptions.words.source}|${regexOptions.numberOnly.source}|${regexOptions.squareBrackets.source})`;
