import { split } from "string-ts";
import { eliminerUndefined } from "../utils";

/**
 * @classdesc Take allUnits groups from regex and make an array from it
 * @class AllUnitsHandler
 *@example p-4-4-6-7 or px-5-4
 */
class AllUnitsHandler {
	match: RegExpMatchArray | null;
	duplicate: boolean;
	sizeLimite: number;
	#tempString = "";
	/**
	 *
	 * @param {RegExpMatchArray} match
	 * @param  {number} sizeLimite - what is the max of arguments in padding or margin
	 * @param {boolean} duplicate - Do you want to auto remove duplicate exemple px-5-5 => px-5
	 */
	constructor(match: RegExpMatchArray | null, sizeLimite: number, duplicate: boolean) {
		this.match = match;
		this.duplicate = duplicate;
		this.sizeLimite = sizeLimite;
	}
	/**
	 * @deprecated
	 */
	get groups(): string {
		const s = this.match?.groups?.allUnits;
		eliminerUndefined<string>(s, "undefined in class AllUnitsHandler");
		this.#tempString = s;
		return this.#tempString;
	}

	get execRegex(): string[] {
		if (this.match) {
			return this.match.slice(1, this.sizeLimite + 1).filter(Boolean);
		}
		return [];
	}

	/**
	 *
	 * @param array
	 * @description check if array is too long
	 * @returns type assertion
	 */
	checkLimiteSize(array: unknown[]): asserts array is string[] {
		if (array.length > this.sizeLimite) console.error("You gave too much arguments !");
	}
	/**
	 * @deprecated
	 */
	get splitedArray(): string[] {
		const splitt = split(this.#tempString, "-");
		this.checkLimiteSize(splitt);
		return this.removeDuplicateOptional(splitt);
	}
	removeDuplicateOptional(x: string[]): string[] {
		return this.duplicate === true ? [...new Set(x)] : x;
	}

	get returnArray2(): string[] {
		try {
			this.checkLimiteSize(this.execRegex);
			return this.removeDuplicateOptional(this.execRegex);
		} catch (error) {
			throw new Error("error in AllUnitsHandler returnArray2");
		}
	}
}

export default AllUnitsHandler;
