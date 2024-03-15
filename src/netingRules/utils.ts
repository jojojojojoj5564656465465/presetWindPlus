import { includes, split, toLowerCase, trim } from "string-ts";
import { eliminerUndefined } from "../utils";

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
	try {
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
	} catch (error) {
		throw new Error("🫎🫎 splitString eliminerUndefined function is ${arg_splitString} ET N EXISTE PAS ");
	}
}

/**
 * Description: Remove duplicates in an array: [hover , hover, red]  = [hover , red]
 * @param {(string|Before)} array
 * @returns {string[]} without duplicate in a string[]
 */
export function removeDuplicates(array: (string | Before)[]): string[] {
	return [...new Set(array)];
}


export class BuildTailwindKiller {
	category: Category;
	noRegex: Set<string>;

	constructor(category: Category, noRegex: Set<string>) {
		this.category = category;
		this.noRegex = noRegex;
	}

	private makeArrayFromTempMapNoRegex(): string[][] {
		return Array.from(this.noRegex, (x) => x.split(":").filter(Boolean));
	}

	private AddCatergoryToArray(array: string[][]): string[][] {
		for (const subArray of array) {
			subArray.splice(subArray.length - 1, 0, this.category);
		}
		return array;
	}

	private makeFinalStringWithCategory(array: string[][]): string {
		const results = new Set<string>();
		for (const subArray of array) {
			const before: string[] = subArray.slice(0, subArray.length - 2);
			const catAndCSS: string[] = subArray.slice(-2);

			const result = before.length > 0 ? `${before.join(":")}:${catAndCSS.join("-")}` : catAndCSS.join("-");
			results.add(result);
		}
		return Array.from(results).join(" ");
	}
	get build(): string {
		const ArrayReadyToModify = this.makeArrayFromTempMapNoRegex();
		const AddCategory = this.AddCatergoryToArray(ArrayReadyToModify);
		return this.makeFinalStringWithCategory(AddCategory);
	}
}
