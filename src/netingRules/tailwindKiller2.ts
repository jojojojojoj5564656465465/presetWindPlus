import TempMapClass from "../Class/TempMap";
// import { join, replace, split } from "string-ts";
//import { IfRegex } from "../Class/ifRegex";
import { finalStringProcess, splitString } from "./utils";

/**
 *
 * @param {category} category - col|row|grid|font|text|bg|border|stroke|outline|underline|ring|divide
 * @param {string} x string inside []
 * @returns {string}
 */
function tailwindKiller2(category: Category, x: string) {
	const splitFromString: Set<string> = splitString(x); /// good
	const T = new TempMapClass(splitFromString);

	try {
		T.sendToRegexOrNoRegex();
		while (T.SizeIsZero) {
			T.IfRegex2;
			T.sendToRegexOrNoRegex();
		}
		const ArrayReadyToModify = finalStringProcess.makeArrayFromTempMapNoRegex(T._noRegex);
		const AddCategory = finalStringProcess.AddCatergoryToArray(ArrayReadyToModify, category);
		return finalStringProcess.makeFinalStringWithCategory(AddCategory);
	} catch (error) {
		console.error("💔💔💔💔", error);
	}
}
export default tailwindKiller2;
