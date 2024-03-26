import { split } from "string-ts";
import { matchFromRegex } from "../utils";
type Element = string | `${number}` | Size | Regex;

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
	EachElement: Element;
	/**
	 * Split from string 6-4-min-[25px] will make an array
	 * [6,4,min,[25px]]
	 * @param {Element} EachElement - Each element
	 */
	constructor(EachElement: Element) {
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
		dvh: "100dvh",
		svw: "100svw",
		svh: "100svh",
		lvw: "100lvw",
		lvh: "100lvh",
		px: "1px",
	} as const satisfies Record<Size, string>;

	NumberP(x = this.el): x is `${number}` {
		return !Number.isNaN(Number(x));
	}

	IncludesP(x = this.el): x is Size {
		return x in this.size;
	}

	insideBraketP(x = this.el): x is Regex {
		return this.regex.Braket.test(x);
	}

	fractionP(x = this.el): x is `${string}/${string}]` {
		const fraction: RegExp = /(^\w{1}\/\w{1}$)/;
		return fraction.test(x);
	}

	regex = {
		// biome-ignore lint/complexity/useRegexLiterals: <explanation>
		Braket: new RegExp("^\\[(?<insideBrakets>\\w+)\\]"),

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
		try {
			if (this.NumberP()) {
				this.el = this.convertToRem(this.EachElement);
			} else if (this.IncludesP()) {
				this.el = this.size[this.el as keyof typeof this.size];
			} else if (this.fractionP()) {
				this.el = this.fractionPourcentageGenerator(this.el as `${string}/${string}`);
			} else if (this.insideBraketP()) {
				const match = this.el.match(this.regex.Braket) as RegExpMatchArray;
				const groups = matchFromRegex<string>(match, "insideBrakets");
				this.el = this.valideinsideBraket(groups) ? groups : "error-insid-brakets";
			} else {
				this.el = "error size";
			}
		} catch (error) {
			console.error(error);
		}
	}
}

export default UnitArray;
