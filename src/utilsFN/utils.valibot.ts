import * as v from "valibot";

/**
 * @description Split inside the lg:[....] log error if more than 2 elements in Array
 * @param {string} x
 * @returns {Set<string>} works only if there is , inside the string
 */
export const splitValibot = v.undefinedable(
	v.pipe(
		v.string(),
		v.trim(),
		v.toLowerCase(),

		v.transform((string) =>
			string
				.replace(/,+/g, " ")
				.replace(/:{2,}/g, ":")
				.replace(/\s+|\|+/g, ",")
				.replace(/\w+:?\[\w?\]/g, "")
				.replace(/\[\]/g, "")
				.replace(/(?<=\])(\w+)/g, "],$1")
				.replace(/(\w+)(\[[\w-,@:]+\])/g, "$1:$2")
				.replace(/(?<=\[)([\w:@-]+)$/, "$1"),
		),
		v.transform((arg_string) => {
			let countBrackets = 0;
			const result = new Set<string>();
			let currentElement = "";
			for (const char of arg_string) {
				if (char === "[") countBrackets++;
				else if (char === "]") countBrackets--;

				if (char === "," && countBrackets === 0) {
					result.add(currentElement);
					if (currentElement) {
						currentElement = "";
					}
				} else {
					currentElement += char;
				}
			}
			if (currentElement !== "") result.add(currentElement.toLowerCase());
			return result;
		}),
	),
	"arg_splitStringValibot undefined",
);

/** MARK: DICO */
const combination = {
	px: "padding-inline",
	py: "padding-block",
	mx: "margin-inline",
	my: "margin-block",
	gap: "gap",
	p: "padding",
	m: "margin",
	inset: "inset",
	x: "inset-inline",
	y: "inset-block",
} as const;

const dictionaryCheckAndTransform = v.pipe(
	v.string(),
	v.nonEmpty(),
	v.custom<keyof typeof combination>(
		(input) =>
			// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
			(typeof input === "string" && combination.hasOwnProperty(input)) ?? false,
		"ELEMENT IS NOT PART OF DICTIONARY",
	),
	v.transform((string) => combination[string]),
	v.description("check if string is part of dictionary"),
);

export default v.parser(dictionaryCheckAndTransform);
