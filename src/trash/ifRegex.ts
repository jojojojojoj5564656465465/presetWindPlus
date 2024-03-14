import { join } from "string-ts";
import { TempMap, splitString } from "../netingRules/utils";
import { eliminerUndefined } from "../utils";

class IfRegex {
	texte: Regex | string;
	/**
	 *
	 * @param {Regex} texte
	 */
	constructor(texte: Regex | string) {
		this.texte = texte;
	}

	get _texte(): string {
		return this.texte;
	}

	set _texte(x: Set<string>) {
		if (x === undefined) console.error("this.texte is undefined class IfRegex");
		const arr = Array.from(x).filter(Boolean);
		this.texte = join(arr, ":");
	}

	#nestedBrackets: RegExp = /(?<before>.*):\[(?<css>.*)\]/;
	isNestingRegex(x = this.texte): x is Regex {
		return this.#nestedBrackets.test(x);
	}

	PredicatRegex(input: string): input is Regex {
		return this.regex.isRegexTest.test(input);
	}

	aacheckIfRegexAndSendToMAP(x: Regex | string): void {
		function sendToMap(name: "isRegex" | "noRegex", x: string) {
			eliminerUndefined<Set<string>>(TempMap.get(name));
			return TempMap.get(name)?.add(x);
		}
		this.PredicatRegex(x) ? sendToMap("isRegex", x) : sendToMap("noRegex", x);
	}
	checkIfRegexAndSendToMAP(x: string): void {
		function sendToMap<T extends "isRegex" | "noRegex", K extends TempMap<T>>(name: T, x: K) {
			return TempMap.get(name)?.add(x);
		}
		if (this.PredicatRegex(x)) {
			sendToMap("isRegex", x);
		} else {
			sendToMap("noRegex", x);
		}
	}

	/**
	 *new Map always give me ts error so i made this function to eliminate the Undefinded issue
	 * @param {"isRegex" | "noRegex"} params - isRegex or noRegex
	 * @returns
	 * @deprecated
	 */
	static mapGet<T extends "isRegex" | "noRegex">(params: T) {
		const result = TempMap.get(params);
		if (!TempMap.has(params)) {
			throw new Error(`${params} is missing"`);
		}
		return result;
	}

	regex = {
		isRegexTest: /(?<before>^[@?\w:]+):\[(?<css>[@\-\w:,[\]]+)\]$/, /// jai mis un truc plud complet
		before: /^(?<before>.*?)(?=:\[)/,
		css: /(?<=:\[)(?<css>.+)(?=\])/,
	};

	createObjectFromRegex(regexVariable: string): Set<string> {
		this.PredicatRegex(regexVariable);
		const matchFn = (x: RegExp) => {
			const temp = regexVariable.match(x)?.[1];
			eliminerUndefined<string>(temp);
			return temp;
		};
		const obj: Record<"before" | "css", string> = {
			before: matchFn(this.regex.before),
			css: matchFn(this.regex.css),
		};
		const tempCss = splitString(obj.css);
		const returnSet = new Set<string>();
		for (const e of tempCss) returnSet.add(`${obj.before}:${e}`);

		return returnSet;
	}
	/*
		forloop(): void {
			const set: Set<string> = splitString(this._texte);

			for (const iterator of set) this.checkIfRegexAndSendToMAP(iterator);

			for (const iterator of IfRegex.mapGet("isRegex")) {
				const result: Set<string> = this.createObjectFromRegex(iterator);
				for (const el of result) this.checkIfRegexAndSendToMAP(el);

				this._texte &&= IfRegex.mapGet("noRegex");
			}
		}*/
}
