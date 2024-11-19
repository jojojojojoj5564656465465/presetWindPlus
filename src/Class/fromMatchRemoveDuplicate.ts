import * as v from "valibot";
import { UnitArray2 } from ".";
import { myUnits, removeDuplicateArrayPaddingOrMargin } from "../utils";



const matchFromStringRegex = v.fallback(v.pipe(
	v.string(),
	v.transform((e) => e.match(new RegExp(myUnits.source, "g"))),
	v.transform((e) => (e === null ? [] : Array.from(e))),
	v.filterItems((e) => e !== ""),
),[]);



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
	v.pipe(
		matchFromStringRegex,
		v.array(v.string()),
		v.maxLength(sizeLimit, `Size Limit ${sizeLimit} is too big`),
		v.transform((array) => (duplicate ? [...new Set(array)] : array)),
		v.mapItems((item) => UnitArray2(item)),
		v.transform(removeDuplicateArrayPaddingOrMargin),
	)
export default fromMatchRemoveDuplicate;

 
