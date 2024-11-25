import * as v from "valibot";
import { splitValibot } from "../utils/utils.valibot";
import { join, split } from "string-ts";
/**
 * @description Map of regex use to do the process
 */
const mapRegex = new Map<string, Set<string>>();
const setOfNORegex = new Set<string>();

/**
 * @description when a string is not a regex it is added to the set
 * then the set is transformed in an array when Set is FULL
 * @MARK: NO Regex
 */
const NoRegex = {
	addToSet: v.pipe(
		v.string("must be a string inside the Set Please"),
		v.regex(/^\[[@\w:-]+\]$|[@\w:-]+$/, "Must be a no regex like [string]|string"),
		v.transform((noRegexStr) => setOfNORegex.add(noRegexStr)),
	),
	convertToArray: v.pipe(
		v.set(v.pipe(v.string("must be a string inside the Set Please"), v.regex(/^\[[@\w:-]+\]$|[@\w:-]+$/, "Must be a no regex like string:[string]"))),
		v.transform((e) => Array.from(e, (e) => split(e, ":"))),
		v.minLength(1),
	),
};

const isRegex = v.undefinedable(
	v.pipe(
		v.string("must be a string inside the Set Please"),
		v.custom<Regex>((input) => (typeof input === "string" ? /(?<before>^@?[a-z:]{2,}):\[(?<css>[%./@\-\w:,[\]]+)\]$/.test(input) : false)),
		v.transform((isRegexStr) => {
			const match = isRegexStr.match(/(?<before>^@?[a-z:]{2,}):\[(?<css>[%/@\-\w:.,[\]]+)\]$/);
			const before = v.parse(v.string("before is not string type isRegex"), match?.groups?.before);
			const css = v.parse(v.string("css is not a string type isRegex"), match?.groups?.css);
			mapRegex.set(before, v.parse(splitValibot, css));
		}),
		v.transform(processMapDoWhile),
	),
	"must be a string inside the Set Please",
);

export function init(Initial: Set<string>): Set<string> {
	setOfNORegex.clear();
	for (const iterator of Initial) {
		v.parse(v.union([isRegex, NoRegex.addToSet]), iterator);
	}
	Initial.clear();
	processMapDoWhile();
	return setOfNORegex;
}

function processMapDoWhile(): void {
	let iteration = 0;
	while (mapRegex.size > 0 && iteration < 6) {
		iteration++;
		const TempSet = new Set<string>();
		mapRegex.forEach((value, key) => {
			for (const iterator of value) {
				TempSet.add(`${key}:${iterator}`);
			}
		});
		mapRegex.clear();
		for (const element of v.parse(v.set(v.string("must be a string inside the TempSet")), TempSet)) {
			v.parse(v.union([isRegex, NoRegex.addToSet]), element);
		}
	}
}

const firstString = v.fallback(v.pipe(v.string("must be a string inside firstString"), v.nonEmpty("text was empty"), v.regex(/^\w[/!@\-\w:[\]]+,[/!@\-\w,:[\]]+[\w|\]]$/, "coma is missing in regex")), "0in"); // /////////////////////////////////////////////
/**
 * MARK: function builder
 */
// /////////////////////////////////////////////
const processString = (x: string): Set<string> => {
	try {
		const X = v.parse(firstString, x);
		const Initial = v.parse(splitValibot, X);

		init(Initial);
		return setOfNORegex;
	} catch (error) {
		console.log("error in processString");

		if (error instanceof v.ValiError) {
			console.log("error Valibot");
			console.error(error.issues);
			console.error(error.cause);
		}
		return new Set<string>(["error #1"]);
	}
};

function tailwindKiller3(category: Category, value: string): string | null {
	const setElement: Set<string> = processString(value);
	const arrayOf = v.pipe(
		NoRegex.convertToArray,
		v.mapItems((e) => {
			e.splice(e.length - 1, 0, category);
			return e;
		}),
		v.mapItems((e) => {
			const Before = e.slice(0, -1).join(":");
			const CatCss = e.pop();
			return `${Before}-${CatCss}`;
		}),
		v.transform((e) => join(e, " ")),
	);
	const parser = v.safeParser(arrayOf);
	const result = parser(setElement);
	if (result.success) {
		return result.output;
	}
	console.error("error in safe parser: tailwindKiller3", result.issues);
	return null;
}

export default tailwindKiller3;
