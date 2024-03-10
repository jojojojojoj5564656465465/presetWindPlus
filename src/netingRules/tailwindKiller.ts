// import { join, replace, split } from "string-ts";
import { IfRegex } from "../Class/ifRegex";
import { finalStringProcess, moveToSetIfNoRegex, splitString } from "./utils";
import TempMapClass from "../Class/TempMap";

/**
 *
 * @param {category} category - col|row|grid|font|text|bg|border|stroke|outline|underline|ring|divide
 * @param {string} x string inside []
 * @returns {string}
 */
function tailwindKiller(category: Category, x: string) {
	const splitFromString: Set<string> = splitString(x); /// good
	for (const iterator of splitFromString) moveToSetIfNoRegex(iterator);

	for (const iterator of IfRegex.mapGet("isRegex")) {
		const element = new IfRegex(iterator);
		element.forloop();
	}
	const ArrayReadyToModify = finalStringProcess.makeArrayFromTempMapNoRegex();
	const AddCategory = finalStringProcess.AddCatergoryToArray(ArrayReadyToModify, category);
	return finalStringProcess.makeFinalStringWithCategory(AddCategory);
}
export default tailwindKiller;
