import { splitString } from "../netingRules/utils";
//import { RegexError } from "../Class/regexError";
import { RegexError } from "./index";
export default class TempMapClass {
	Initial: Set<string> | null;
	IsRegex: Set<Regex>;
	noRegex: Set<string>;

	constructor(Initial: Set<string>) {
		this.Initial = Initial;
		this.IsRegex = new Set<Regex>();
		this.noRegex = new Set<string>();
	}
	get showConstructor() {
		return {
			constructor___Initial: this.Initial,
			constructor___is: this._IsRegex,
			constructor___no: this.noRegex,
		};
	}
	get _IsRegex(): Set<Regex> {
		return this.IsRegex;
	}
	set _IsRegex(x: Regex) {
		this.IsRegex.add(x);
	}
	get _noRegex(): Set<string> {
		return this.noRegex;
	}
	set _noRegex(x: string) {
		this.noRegexP(x);
		this.noRegex.add(x);
	}

	/**
	 * @description size of isRegex
	 */
	get SizeIsZero(): boolean {
		return this.IsRegex?.size > 0;
	}

	private regex = {
		is: /(?<before>^[@?\w:]+):\[(?<css>[@\-\w:,[\]]+)\]$/,
		no: /(?<css>^\[?[@?\w:-]+\]?)$/,
	} as const satisfies Record<string, RegExp>;

	/**
	 * @description Predicate if it's a regex or not
	 * @param input
	 * @returns
	 */
	private isRegexP(input: string): input is Regex {
		return this.regex.is.test(input);
	}

	private noRegexP(input: string): asserts input is string {
		const result: boolean = this.regex.no.test(input);
		if (!result) {
			throw new RegexError("this.regex.no🀄🀄", this.regex.no, input);
		}
		if (this.isRegexP(input)) {
			throw new RegexError("ATTENTION: IT'S A regex in no regex🀄🀄", this.regex.is, input);
		}
	}

	/**
	 *
	 * @returns send to the right TempMap if it's a regex or not
	 * @description use predicate to know if it's a regex or not
	 */
	sendToRegexOrNoRegex(): void {
		const x: Set<string | Regex> = this.Initial ?? this._IsRegex;

		for (const iterator of x) {
			if (iterator === undefined) {
				throw new Error(`${iterator} is undefined in ADD FUNCTION`);
			}
			if (this.isRegexP(iterator)) {
				this._IsRegex = iterator;
			} else {
				this._noRegex = iterator;
			}
		}
		this.Initial?.clear();
	}

	/**
	 * @description fonction qui va capturer le before et le css
	 * et faire une map avec le before comme clef et le css comme valeur
	 */
	get IfRegex2() {
		const splitedIsRegex = new Map<string, Set<string>>();
		for (const iterator of this._IsRegex) {
			const match = iterator.match(this.regex.is);
			const before = match?.groups?.before;
			const css = match?.groups?.css;
			if (before === undefined || css === undefined) {
				throw new Error("match in IfRegex is undefined");
			}
			splitedIsRegex.set(before, splitString(css));
		}
		return this.sendBackTo3(splitedIsRegex);
	}

	/**
	 *
	 * @param x
	 */
	sendBackTo3(x: Map<string, Set<string>>) {
		const TempSet = new Set<string>();
		x.forEach((value, key) => {
			for (const iterator of value) {
				TempSet.add(`${key}:${iterator}`);
			}
		});
		this.Initial?.clear();
		this.Initial = TempSet;
		this.IsRegex.clear();
	}
}
