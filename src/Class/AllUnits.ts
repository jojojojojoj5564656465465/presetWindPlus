/**
 * @classdesc Take all units groups from regex and make an array from it
 * @class AllUnitsHandler
 * @example p-4-4-6-7 or px-5-4
 */
class AllUnitsHandler {
  match: RegExpMatchArray | null;
  duplicate: boolean;
  sizeLimit: number;

  /**
   * @param {RegExpMatchArray | null} match - The regex match array
   * @param {number} sizeLimit - The maximum number of arguments in padding or margin
   * @param {boolean} duplicate - Whether to auto remove duplicates (e.g., px-5-5 => px-5)
   */
  constructor(
    match: RegExpMatchArray | null,
    sizeLimit: 1 | 2 | 4,
    duplicate: boolean
  ) {
    this.match = match;
    this.duplicate = duplicate;
    this.sizeLimit = sizeLimit;
  }

  /**
   * @returns {string[]} - The processed regex matches
   *  @deprecated
   */
  get execRegex(): string[] {
    if (this.match) {
      return this.match.slice(1, this.sizeLimit + 1).filter(Boolean);
    }
    return [];
  }

  /**
   * @param {unknown[]} array - The array to check
   * @throws {Error} - Throws an error if the array exceeds the size limit
   * @deprecated
   */
  checkLimitSize(array: unknown[]): asserts array is string[] {
    if (array.length > this.sizeLimit) {
      throw new Error("You gave too many arguments!");
    }
  }

  /**
   * @param {string[]} array - The array to process
   * @returns {string[]} - The array with duplicates removed if specified
   *  @deprecated
   */
  removeDuplicates(array: string[]): string[] {
    return this.duplicate ? [...new Set(array)] : array;
  }

  /**
   * @returns {string[]} - The final processed array
   * @throws {Error} - Throws an error if there's an issue processing the array
   */
  get returnArray(): string[] {
    try {
      const regexResult = this.execRegex;
      this.checkLimitSize(regexResult);
      return this.removeDuplicates(regexResult);
    } catch (error) {
      throw new Error("Error in AllUnitsHandler returnArray");
    }
  }
}

export default AllUnitsHandler;

import * as v from "valibot";

/**
 * 
 * @param sizeLimit how many elements is used
 * @param duplicate do you want to remove duplicates or not
 * @returns string[]
 * @example unitsFromMatch_removeDuplicates(1, true) => ["4"]
 * @example unitsFromMatch_removeDuplicates(2, true) => ["4", "6"]
 * @example unitsFromMatch_removeDuplicates(4, true) => ["4", "6", "7"]
 * @description this function is used to remove duplicates from an array extracted from a regex match
 */
export const unitsFromMatch_removeDuplicates = (
  sizeLimit: 1 | 2 | 4,
  duplicate: boolean
) =>
  v.fallback(
    v.pipe(
      v.array(v.string()),
      v.maxLength(5),
      v.minLength(2),
      v.transform((arr) => arr.slice(1, sizeLimit + 1)),
      v.check(
        (arr) => arr.length < sizeLimit,
        "Size Limite is under nb arguments "
      ),
      v.transform((array) => (duplicate ? [...new Set(array)] : array))
    ),
    []
  );


