import * as v from "valibot";
import { Units } from ".";
import { myUnits, removeDuplicateArrayPaddingOrMargin } from "../utils";

const matchFromStringRegex = v.fallback(
	v.pipe(
		v.string(),
		v.transform((e) => e.match(new RegExp(myUnits.source, "g"))),
		v.transform((e) => (e === null ? [] : Array.from(e))),
		v.filterItems((e) => e !== ""),
	),
	[],
);

/// used below↓↓↓↓↓↓↓↓↓

/**
 *
 * @param {number} sizeLimit how many elements is used
 * @param {boolean} duplicate do you want to remove duplicates or not
 * @param {string | undefined} match match.groups.ELEMENT
 * @returns {string[]}
 * @example unitsFromMatch_removeDuplicates(1, true) => ["4"]
 * @example unitsFromMatch_removeDuplicates(2, true) => ["4", "6"]
 * @example unitsFromMatch_removeDuplicates(4, true) => ["4", "6", "7"]
 * @description this function is used to remove duplicates from an array extracted from a regex match
 */
const fromMatchRemoveDuplicate = (sizeLimit: 1 | 2 | 4, duplicate: boolean, match: string | undefined) => {
	const parser = v.safeParser(
		v.pipe(
			matchFromStringRegex,
			v.array(v.string()),
			v.maxLength(sizeLimit, `Size Limit ${sizeLimit} is too big`),
			v.transform((array) => (duplicate ? [...new Set(array)] : array)),
			v.mapItems((item) => Units(item)),
			v.transform(removeDuplicateArrayPaddingOrMargin),
		),
	);
	return parser(match);
};
export default fromMatchRemoveDuplicate;
