import { split } from "string-ts";

/**
 * This is a description of the MyClass constructor function.
 * @class Fonction
 * @classdesc Functions for All units process in Index.ts
 * @property {string} name - The name of the function.
 */
class Fonction {
	eliminerUndefined<T>(input: unknown, msg?: string): asserts input is T {
		if (input === undefined) console.error(msg ?? "Value is undefined");

		if (input === null) console.error(msg ?? "Value is null");
	}

	convertToRem(x: string) {
		const result = Number(x) / 4;
		return `${result}rem`;
	}

	fractionPourcentageGenerator = (x: `${string}/${string}`): `${number}%` => {
		const array = split(x, "/") as [string, string];
		const pourcentage: number = (~~array[0] / ~~array[1]) * 100;
		return `${pourcentage}%`;
	};
}

class UnitArray extends Fonction {
	EachElement: string;
	/**
	 * Split from string 6-4-min-[25px] will make an array
	 * [6,4,min,[25px]]
	 * @param {string} EachElement - Each element
	 */
	constructor(EachElement: string) {
		super();
		this.EachElement = EachElement;
	}

	get el() {
		return this.EachElement;
	}

	set el(x) {
		this.EachElement = x;
	}

	size = {
		full: "100%",
		screen: "100vw",
		min: "min-content",
		max: "max-content",
		fit: "fit-content",
		fill: "fill",
		auto: "auto",
		dvw: "100dvw",
		svw: "100svw",
		lvw: "100lvw",
	} satisfies Record<string, string>;

	get NumberP(): boolean {
		return !Number.isNaN(Number(this.el));
	}

	get IncludesP(): boolean {
		return this.el in this.size;
	}

	get insideBraket() {
		return this.regex.Braket.test(this.el);
	}

	get fractionP() {
		return this.regex.fraction.test(this.el);
	}

	regex = {
		// biome-ignore lint/complexity/useRegexLiterals: <explanation>
		Braket: new RegExp("^\\[(?<insideBrakets>\\w+)\\]"),
		// biome-ignore lint/complexity/useRegexLiterals: <explanation>
		fraction: new RegExp("(^\\w{1}\\/\\w{1}$)"),
		// biome-ignore lint/complexity/useRegexLiterals: <explanation>
		valideInsideBraket: new RegExp("^\\d+\\w+$"),
	};

	valideinsideBraket(x: string) {
		return this.regex.valideInsideBraket.test(x);
	}

	/**
	 * @description convert this.el to the right unit
	 * @example Number => Number/4
	 * @example string => string
	 * @example [string] => string
	 * @example 1/2 => 50%
	 *
	 */
	numberRemOrString() {
		if (this.NumberP) {
			this.el = this.convertToRem(this.EachElement);
		} else if (this.IncludesP) {
			this.el = this.size[this.el as keyof typeof this.size];
		} else if (this.fractionP) {
			this.el = this.fractionPourcentageGenerator(this.el as `${string}/${string}`);
		} else if (this.insideBraket) {
			const match = this.el.match(this.regex.Braket);
			const groups = match?.groups?.insideBrakets as string;
			this.el = this.valideinsideBraket(groups) ? groups : "error-insid-brakets";
		} else {
			this.el = "error size";
		}
	}
}

export default UnitArray;
