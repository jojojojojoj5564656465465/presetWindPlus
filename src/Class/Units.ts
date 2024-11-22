import * as v from "valibot";
import { dictionaryCheckAndTransform } from "../utils";

const convertToRem = v.pipe(
	v.string(),
	v.trim(),
	v.transform(Number),
	v.number("convert to rem only accept number into a string"),
	v.transform((el) => el / 4),
	v.transform((el) => el.toFixed(2)),
	v.transform((el) => `${el}rem`),
);
const convertToPhi = v.pipe(
	v.string(),
	v.regex(/(\d+)ø/),
	v.transform((golden) => Number(golden.replace("ø", ""))),
	v.transform((phi) => ((1 + Math.sqrt(5)) / 2) * phi),
	v.transform((el) => `${el}rem`),
);

const validateInput__Divide_NumByDenominator = v.pipe(
	v.string(),
	v.nonEmpty("The string should contain at least one character."),
	v.includes("/", "must be fraction using ==> /"),
	v.regex(/^[1-9][0-9]{0,2}\/[1-9][0-9]{0,3}$/, "must be a Fraction like 1/2 or 5/9"),
	v.transform((str) => str.split("/")),
	v.tuple([v.pipe(v.string(), v.transform(Number)), v.pipe(v.string(), v.transform(Number))]),
	v.transform((e) => (e[0] / e[1]) * 100),
	v.transform((e) => e.toFixed(3)),
	v.transform((digit) => `${digit}%`),
	v.description("check if array of 2 numbers and divide by num/de numerator"),
);

const Brackets = v.pipe(
	v.string(),
	v.trim(),
	v.startsWith("["),
	v.endsWith("]"),
	v.regex(/^\[[-+]?[0-9]*\.?[0-9]{0,2}(?:[a-z]{2,4}|%)\]$/),
	v.transform((e) => e.match(/^\[([-+]?[0-9]*\.?[0-9]{0,2}(?:[a-z]{2,4}|%))\]$/)),
	v.transform((e) => e?.[1]),
	v.string("Could not find unit inside brackets like [24px]"),
	v.description("find brackets and capture inside [-3.6vw] [45%]"),
);

const caseSwitch = v.undefinedable(
	v.union([
		convertToPhi,
		convertToRem,
		dictionaryCheckAndTransform, // check if dictionary and transform
		validateInput__Divide_NumByDenominator,
		Brackets,
	]),
	"0vw",
);

const exp = (x: string) => {
	const result = v.safeParse(caseSwitch, x);
	if (result.success) {
		return result.output;
	}
	console.error("UNITS VALIBOT code:#51", result.issues);
	console.error("UNITS VALIBOT code:#51", result.typed);
	return "0in";
};
export default exp;
