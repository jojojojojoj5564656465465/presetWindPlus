
import { includes, split } from "string-ts";
//import { eliminerUndefined } from "../utils";
import * as v from "valibot";
/**
 * @description Split inside the lg:[....] log error if more than 2 elements in Array
 * @param {string} x
 * @returns {string[][]} Array of string or throw an error
 * @MARK: split inside the lg:[....] log error if more than 2 elements in Array
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
const supprimerEspacesDansChaine = (chaine: string): string => {
  return chaine
    .replace(/,+/g, " ")
    .replace(/:{2,}/g, ":")
    .replace(/\s+|\|+/g, ",")
    .replace(/(?<=\[)([\w:@-]+)$/, "$1")
};

const arg_splitStringValibot = v.undefinedable(v.pipe(
  v.string(),
  v.trim(),
  v.toLowerCase(),
  v.transform(supprimerEspacesDansChaine)
),"0");

const returnSet = v.set(arg_splitStringValibot);
/**
 * Description first function to use to split by (,)
 * @param {string} arg_splitString
 * @returns {Set<string>}
 */
export function splitString(arg_splitString: string | undefined): v.InferOutput<typeof returnSet> {
  let countBrackets = 0;
  const result = new Set<string>();
  let currentElement = "";
  for (const char of v.parse(arg_splitStringValibot, arg_splitString)) {
    if (char === "[") countBrackets++;
    else if (char === "]") countBrackets--;

    if (char === "," && countBrackets === 0) {
      result.add(currentElement);
      currentElement &&= "";
    } else {
      currentElement += char;
    }
  }
  if (currentElement !== "") result.add(currentElement.toLowerCase());
  return v.parse(returnSet, result);
}
/**
 * Description: Remove duplicates in an array: [hover , hover, red]  = [hover , red]
 * @param {(string|Before)} array
 * @returns {string[]} without duplicate in a string[]
 * MARK: remove duplicates in an array
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

            	private AddCategoryToArray(array: string[][]): string[][] {
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
		const AddCategory = this.AddCategoryToArray(ArrayReadyToModify);
		return this.makeFinalStringWithCategory(AddCategory);
	}
}

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
  v.custom<keyof typeof combination>(
    (input) =>
      // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
      (typeof input === "string" && combination.hasOwnProperty(input)) ?? false,
    "The list does not match the length."
  ),
  v.transform((string) => combination[string]),
  v.description("check if string is part of dictionary")
);

export const dictionaryParser = v.parser(dictionaryCheckAndTransform);