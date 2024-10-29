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
const fromMatchRemoveDuplicate = (sizeLimit: 1 | 2 | 4, duplicate: boolean) =>
  v.fallback(
    v.pipe(
      v.array(v.string()),
      v.maxLength(5, "array could not be above 5"),
      v.minLength(2, "arr min 2"),
      v.transform((arr) => arr.slice(1, sizeLimit + 1)),
      v.check(
        (arr) => arr.length < sizeLimit,
        "Size Limite is under nb arguments "
      ),
      v.transform((array) => (duplicate ? [...new Set(array)] : array))
    ),
    []
  );
export default fromMatchRemoveDuplicate;
