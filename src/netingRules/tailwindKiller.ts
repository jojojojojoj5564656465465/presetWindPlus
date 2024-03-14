import TempMapClass from "../Class/TempMap";
// import { join, replace, split } from "string-ts";
//import { IfRegex } from "../Class/ifRegex";
import { BuildTailwindKiller, splitString } from "./utils";

/**
 *
 * @param {category} category - col|row|grid|font|text|bg|border|stroke|outline|underline|ring|divide
 * @param {string} x string inside []
 * @returns {string}
 */
function tailwindKiller(category: Category, x: string) {
	const splitFromString: Set<string> = splitString(x); /// good
	const T = new TempMapClass(splitFromString);

	try {
		T.sendToRegexOrNoRegex();
		while (T.SizeIsZero) {
			T.IfRegex2;
			T.sendToRegexOrNoRegex();
		}
		const merge = new BuildTailwindKiller(category, T._noRegex);
		return merge.build;
	} catch (error) {
		console.error("💔💔💔💔", error);
	}
}
export default tailwindKiller;
