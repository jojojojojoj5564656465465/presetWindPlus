import UnitArray from "./Class/Units";
import * as v from "valibot";

const arrV = v.pipe(v.array(v.string()), v.minLength(1, "min length is 1 code #44"), v.maxLength(4, "Limit is 4 code #45"));
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
export function removeDuplicateArrayPaddingOrMargin(array: Array<string>): Array<string> {
	switch (v.parse(arrV, array).length) {
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
			if (e === undefined) throw new Error("array convertUnitFromArray is undefined");
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
 * @alias eliminerUndefined
 */
export function eliminerUndefined<T>(input: unknown, msg?: string): asserts input is T {
	if (input === undefined) console.error(msg ?? "Value is undefined 🫎🫎");

	if (input === null) console.error(msg ?? "Value is null 🫎🫎");
}

/**
 *@description avoid undefined in regex TS issues
 * @param match what come from the function as match
 * @param x which group are you looking for
 * @returns string without undefined
 * @MARK: MATCH FROM REGEX
 */
export function matchFromRegex<T = string>(match: RegExpMatchArray, x: string) {
	const result = match.groups?.[x];
	if (result === undefined) {
		throw new Error("the groups you provide is undefined in the Regex matchFromRegex", { cause: result });
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

export function elementFromDictionary<T extends Record<string, string>>(obj: T, key: keyof NoInfer<T>): T[keyof T] {
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
 * @MARK: match Array(6) [
 */
export const matchUnitsNonProcessed = (x: unknown[]) => x?.filter(Boolean).filter(String) as string[];

export const tailwindClasses = {
	m: "margin",
	mx: "margin-inline",
	my: "margin-block",
	mt: "margin-block-start",
	mr: "margin-inline-end",
	mb: "margin-block-end",
	ml: "margin-inline-start",
	p: "padding",
	px: "padding-inline",
	py: "padding-block",
	pt: "padding-block-start",
	pr: "padding-inline-end",
	pb: "padding-block-end",
	pl: "padding-inline-start",
	text: "font-size",
	gap: "gap",
	w: "inline-size",
	h: "block-size",
	border: "border-width",
	outline: "outline-width",
	full: "100%",
	screen: "100vw",
	min: "min-content",
	max: "max-content",
	fit: "fit-content",
	fill: "fill",
	auto: "auto",
	dvw: "100dvw",
	dvh: "100dvh",
	svw: "100svw",
	svh: "100svh",
	lvw: "100lvw",
	lvh: "100lvh",
} as const satisfies Record<string, string>;

export const dictionaryCheckAndTransform = v.pipe(
	v.string(),
	v.custom<keyof typeof tailwindClasses>(
		(input) =>
			// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
			(typeof input === "string" && tailwindClasses.hasOwnProperty(input)) ?? false,
		"dictionaryCheckAndTransform did not find the element you wanted",
	),
	v.transform((string) => tailwindClasses[string]),
	v.description("check if string is part of dictionary"),
);

export const dicoMatch = v.parser(dictionaryCheckAndTransform);

const regexOptions = {
  words: /\b(full|screen|min|max|fit|fill|auto|dvw|dvh|svw|svh|lvw|lvh|px)\b/,
  numberOnly: /\d+(?:\.5)?(?!\w)/,
  fraction: /[1-9]\/[2-9]/,
  squareBrackets: /\[[1-9]\d*\.?\d?(?:\w+|%)\]/,
};

const regexUnit = `(?<!-)(?:${regexOptions.fraction.source}|${regexOptions.words.source}|${regexOptions.numberOnly.source}|${regexOptions.squareBrackets.source})`;




export const myUnits = /(?<!--)([1-9][0-9]?\/[1-9]\d*|\d{1,3}|full|screen|min|max|fit|fill|auto|dvw|dvh|svw|svh|lvw|lvh|px|\[[-+]?[0-9]*\.?[0-9]{0,2}(?:[a-z]{2,4}|%)\])/;
