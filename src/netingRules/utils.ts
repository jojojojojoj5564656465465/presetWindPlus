import { includes, join, split, toLowerCase, trim } from "string-ts";
import { eliminerUndefined } from "../utils";
/**
 * @description join Set to make a string used at end of script
 * @param {Set<string>} 'list of Set of class
 * @returns {string} make one string with space all tailwind class
 */
export function lastJoin(x: Set<string>): string {
	return join([...x], " ");
}

/**
 * @description generate string final lg-hover:bg-red
 * @param {string[][]} array
 * @returns {string}
 */
/*
 function joinArray(array: string[][]): string | never {
	switch (array.length) {
		case 2: {
			const [state, catANDcss] = array as [Before[], [Category, string]];
			const result: [string, `${Category}-${string}`] = [join(state, ":"), `${catANDcss[0]}-${catANDcss[1]}`];
			return join(result, ":");
		}
		case 1: {
			return join(array[0], "-") as `${Category}-${string}`;
		}
		default:
			console.error("limite 2 arrays joinArray");
	}
}
*/

/**
 * @description Split inside the lg:[....] log error if more than 2 elements in Array
 * @param {string} x
 * @returns {string[][]} Array of string or throw an error
 */

export function splitInsideBrakets(x: string) {
	if (!["[", "]", "(", ")"].some((e) => includes(x, e))) {
		if ([",", ":"].some((e) => includes(x, e))) {
			const result: string[][] = [];
			const temp: string[] = removeDuplicates(split(x, ","));
			for (const e of temp) result.push(removeDuplicates(split(e, ":")));

			return result;
		}
		return [[x]];
	}

	console.error("error in Syntax ':[]' is missing OR '('  ')' IS NOT ALLOWED \n no dynamic values please \n\n ");
}
/**
 * Description first function to use to split by (,)
 * @param {string} arg_splitString
 * @returns {Set<string>}
 */
export function splitString(arg_splitString: string | undefined): Set<string> {
	eliminerUndefined<string>(arg_splitString, `🫎🫎 splitString eliminerUndefined function is ${arg_splitString} ET N EXISTE PAS `);
	const removeSpaceInString = (string: string): string => {
		return trim(string)
			.replace(/,+/g, " ")
			.replace(/\|+|\s+/g, ",");
	};
	let countBrackets = 0;

	const result = new Set<string>();
	let currentElement: currentElement<typeof countBrackets> = "";
	for (const char of removeSpaceInString(arg_splitString)) {
		if (char === "[") countBrackets++;
		else if (char === "]") countBrackets--;

		if (char === "," && countBrackets === 0) {
			result.add(trim(toLowerCase(currentElement)));
			currentElement &&= "";
		} else {
			currentElement += trim(char);
		}
	}
	if (trim(currentElement) !== "") result.add(trim(toLowerCase(currentElement)));
	return result;
}

/**
 * Description: Remove duplicates in an array: [hover , hover, red]  = [hover , red]
 * @param {(string|Before)} array
 * @returns {string[]} without duplicate in a string[]
 */
export function removeDuplicates(array: (string | Before)[]): string[] {
	return [...new Set(array)];
}

/**
 * @description temporary map to store regex and no regex
 */
export const TempMap = new Map<"isRegex" | "noRegex", Set<string>>([
	["isRegex", new Set<Regex>()],
	["noRegex", new Set<string>()],
]);
/**
 * ancien object a supprimer pour
 * faire une class a ala place
 * @argument je sais pas
 *
 *
 */
export const finalStringProcess = {
	/**
	 * OBJECTIF : Generer des arrays que je vais pouvoir manipuler pour ajouter la categorie en avant dernier
	 * @returns [ "lg", "hover", "first", "orange" ]
	 * @returns {any}
	 */
	makeArrayFromTempMapNoRegex(setOfNoRegex: Set<string>): string[][] {
		return Array.from(setOfNoRegex, (x) => split(x, ":").filter(Boolean));
	},
	AddCatergoryToArray(array: string[][], category: Category): string[][] {
		for (const subArray of array) subArray.splice(subArray.length - 1, 0, category);

		return array;
	},
	makeFinalStringWithCategory(array: string[][]): string {
		const temp = new Set<string>();

		for (const subArray of array) {
			const before: string[] = subArray.slice(0, subArray.length - 2);
			const catAndCSS: string[] = subArray.slice(-2);

			const result = before.length > 0 ? `${before.join(":")}:${catAndCSS.join("-")}` : catAndCSS.join("-");
			temp.add(result);
		}
		return Array.from(temp).join(" ");
	},
};

/**
 *
 * @param x : string
 * @returns send to the right TempMap if it's a regex or not
 * @description use predicate to know if it's a regex or not
 * @deprecated
 */
export function moveToSetIfNoRegex(x: string): void {
	if (x.includes("[")) TempMap.get("isRegex")?.add(x);
	else TempMap.get("noRegex")?.add(x);
}
/**
 * 
 * @deprecated
 * @returns 
 */
function isRegexP(input: unknown): input is Regex {
	const isRegexTest = /:\[/;
	eliminerUndefined<string>(input, "input is undefined");
	return isRegexTest.test(input);
}

/**
 *@description fuction to test on server side only
 * @param str
 * @param regex
 * @returns
 */
export const matcherREGEX = (str: string, regex: RegExp) => str.match(regex) as RegExpMatchArray;
