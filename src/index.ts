import { definePreset } from "@unocss/core";
import UnitProcess from "./Class/Units.valibot";

import * as v from "valibot";

import { convertUnitFromArray, elementFromDictionary, matchFromRegex, myUnits } from "./utils";

import {
	AllUnitsHandler,
	FluidSize,
	//UnitArray2,
	//UnitArray,
	fromMatchRemoveDuplicate,
	//tailwindKiller2, // il faut garder c'est ancien qui marche
} from "./Class";
//import { AllUnitsHandler, UnitArray, FluidSize } from "./Class";
//import tailwindKiller from "./nestingRules/tailwindKiller";
import { dictionaryParser } from "./nestingRules/utils";
import tailwindKiller3 from "./Class/TempMap.valibot";
//import tailwindKiller from "./nestingRules/tailwindKiller";

export interface StarterOptions {
	/**
	 *  The number of columns in the grid system (Example option)
	 *
	 * @default 1650
	 */
	maxScreenW?: number;
	minScreenW?: number;
}
const presetWindPlus = definePreset((_options: StarterOptions = {}) => {
	return {
		name: "presetWindPlus",
		// Customize your preset here
		theme: {
			// Customize your theme here
		},
		rules: [
			[
				/^flex\|(?<grow>\d)\|(?<shrink>\d)\|?(?<basisRegex>[\w\d%/]*)?/,
				(match) => {
					const grow = matchFromRegex<number>(match, "grow");
					const shrink = matchFromRegex<number>(match, "shrink");
					const basis = v.pipe(
						v.string(),
						v.transform(UnitProcess),
						v.description("if basis is here transform it and return it"),
					);
					const basisParser = v.safeParse(basis, match.groups?.basisRegex);
					if (basisParser.success) {
						return {
						flex: `${grow} ${shrink} ${basisParser.output}`,
						};
					}
					return {
						flex: `${grow} ${shrink}`,
					};
				},
				{ autocomplete: "flex|<num>|<num>|(<num>|auto)" },
			],
			[
				/^(?<flex>inline-flex|flex)-(?<direction>row|col)-(?<num>[1-9])$/,
				(match) => {
					const flex = matchFromRegex<"inline-flex" | "flex">(match, "flex");
					const direction = matchFromRegex<"row" | "col">(match, "direction");
					const flexNumber = matchFromRegex(match, "num") as IntRange<1, 10>;
					type PositionProps = Readonly<"start" | "center" | "end">;
					const positions = {
						1: ["start", "start"],
						2: ["center", "start"],
						3: ["end", "start"],
						4: ["start", "center"],
						5: ["center", "center"],
						6: ["end", "center"],
						7: ["start", "end"],
						8: ["center", "end"],
						9: ["end", "end"],
					} as const satisfies Record<typeof flexNumber, readonly [PositionProps, PositionProps]>;
					const display = flex === "inline-flex" ? "inline flex" : "block flex";
					const columnORrow = direction === "row" ? "row" : "column";
					const [justify, align] = positions[flexNumber];
					return {
						display,
						"flex-direction": columnORrow,
						"justify-content": justify,
						"align-items": align,
					};
				},
				{ autocomplete: "flex-(col|row)-(1|2|3|4|5|6|7|8|9)" },
			],
			[
				// /^(?<direction>p|m|inset)-(\w+\.?\/?\d?|\[\d+(?:\w+|%)\])-?(\w+\.?\/?\d?|\[\d+(?:\w+|%)\])?-?(\w+\.?\/?\d?|\[\d+(?:\w+|%)\])?-?(\w+\.?\/?\d?|\[\d+(?:\w+|%)\])?$/,
				new RegExp(`^(?<direction>p|m|inset)-(?<allUnitsRegex>${myUnits.source}-${myUnits.source}-?${myUnits.source}?-?${myUnits.source}?$)`),
				(match) => {

					try {
						//console.log(match?.groups?.allUnitsRegex?.match(new RegExp(myUnits.source, "g")));
					
						const returnDirection = dictionaryParser(match?.groups?.direction);
						//* UNITS
						const arrMatch = v.safeParse(fromMatchRemoveDuplicate(4, false), match?.groups?.allUnitsRegex);
						
						if (arrMatch.success) {

							return { [returnDirection]: arrMatch.output.join(" ") };
						}
						console.error("\n ERROR UNOCSS code:#58 => p m inset", arrMatch.issues);
						return { [returnDirection]: "0in" };
					} catch (error) {
						if (error instanceof v.ValiError) {
							console.error("ERROR UNOCSS code:#58 => p m inset", error.issues[0].message);
						}
					}
				},
				{ autocomplete: "(p|m|inset)-<num>-<num>-<num>-<num>" },
			],
			[
				/(?<direction>^(?:p|m)(?:x|y)|gap)-(\[?\w+%?\]?)-?(\[?\w+%?\]?)?$/,
				(match) => {
					const combination = {
						px: "padding-inline",
						py: "padding-block",
						mx: "margin-inline",
						my: "margin-block",
						gap: "gap",
					} as const satisfies Record<string, string>;
					const direction = matchFromRegex<keyof typeof combination>(match, "direction");
					const ClassArrayOfUnits = new AllUnitsHandler(match, 2, true);
					const array = convertUnitFromArray(ClassArrayOfUnits.returnArray);
					const returnDirection = elementFromDictionary(combination, direction);
					return { [returnDirection]: array.join(" ") };
				},
				{ autocomplete: "(gap|px|py|mx|my)-<num>-<num>" },
			],

			[
				// biome-ignore lint/complexity/useRegexLiterals: <explanation>
				new RegExp("^inset-(?<direction>x|y)-([[|\\]|\\w]+)-?([[|\\]|\\w]+)?$"),

				(match) => {
					const direction = matchFromRegex<"x" | "y">(match, "direction");
					const ClassArrayOfUnits = new AllUnitsHandler(match, 2, true);
					const combination = {
						x: "inset-inline",
						y: "inset-block",
					} as const satisfies Record<"x" | "y", `inset-${string}`>;

					const returnDirection = elementFromDictionary(combination, direction);
					const array = convertUnitFromArray(ClassArrayOfUnits.returnArray);
					return { [returnDirection]: array.join(" ") };
				},
				{ autocomplete: "inset-(x|y)-<num>-<num>" },
			],
			[
				// biome-ignore lint/complexity/useRegexLiterals: <explanation>
				new RegExp("^gap-(?<direction>x|y)-([\\[?\\w%?\\]?]+)$"),
				(match) => {
					const direction = matchFromRegex<"x" | "y">(match, "direction");
					const ClassArrayOfUnits = new AllUnitsHandler(match, 1, true);
					const combination = {
						x: "column-gap",
						y: "row-gap",
					} as const satisfies Record<"x" | "y", string>;

					const returnDirection = elementFromDictionary(combination, direction);
					const array = ClassArrayOfUnits.returnArray.map(UnitProcess);
					return { [returnDirection]: array.join(" ") };
				},
				{ autocomplete: "gap-(x|y)-<num>" },
			],

			[
				/^size-((?:\[\d+\w*%?\]|\d+\/?\.?\d?|[a-z]+))-?((?:\[\d+\w*%?\]|\d+\/?\.?\d?|[a-z]+))?$/,
				(match_allUnits) => {
					const classMatch = new AllUnitsHandler(match_allUnits, 2, true);
					const array: string[] = convertUnitFromArray(classMatch.returnArray);
					if (array[0] !== undefined) {
						return [
							{
								"block-size": array[0],
								"inline-size": array[1] ?? array[0],
							},
						];
					}
					console.error("size allUnits are undefined");
				},
				{ autocomplete: "size-<num>-<num>" },
			],
			[
				/(?<direction>^m(?:(x|y|t|b|l|r)))-trim\b$/,
				(match): Record<"margin-trim", "inline" | "block" | "block-start" | "block-end" | "inline-start" | "inline-end">[] => {
					const s = matchFromRegex<"mx" | "my" | "mt" | "mb" | "ml" | "mr">(match, "direction");
					const dictionary = {
						mx: "inline",
						my: "block",
						mt: "block-start",
						mb: "block-end",
						ml: "inline-start",
						mr: "inline-end",
					} as const satisfies Record<typeof s, string>;
					const returnDirection = elementFromDictionary(dictionary, s);
					return [
						{
							"margin-trim": returnDirection,
						},
					];
				},
				{ autocomplete: "(mx|my|mt|mb|ml|mr)-trim" },
			],
			[
				/^vertical-(rl|lr)$/,
				([, rl_lr = "lr"]): Record<string, `vertical-${typeof rl_lr}`> => {
					const returnArr: string[] = ["-webkit-writing-mode", "-ms-writing-mode", "writingMode"];
					const result: Record<string, `vertical-${typeof rl_lr}`> = {};
					for (const e of returnArr) result[e] = `vertical-${rl_lr}`;
					return result;
				},
				{ autocomplete: "vertical-(rl|lr)" },
			],
			[
				/^grid-area-(?<str>\w+)$/,
				(match): Record<"grid-area", string> => {
					const gridAreaString = matchFromRegex<string>(match, "str");
					return {
						"grid-area": gridAreaString,
					};
				},
			],
			[
				/^~(?<category>m|mx|my|mt|mr|mb|ml|p|px|py|pt|pr|pb|pl|text|gap|w|h|border|outline)-(?<minValue>[1-9][0-9]*)\/(?<maxValue>[1-9][0-9]*)$/,
				(match) => {
					const category = matchFromRegex<"m" | "mx" | "my" | "mt" | "mr" | "mb" | "ml" | "p" | "px" | "py" | "pt" | "pr" | "pb" | "pl" | "text" | "gap" | "w" | "h" | "border" | "outline">(match, "category");
					const minValue = Number(matchFromRegex<string>(match, "minValue"));
					const maxValue = Number(matchFromRegex<string>(match, "maxValue"));
					return FluidSize({
						category,
						minScreenW: _options.minScreenW ?? 320,
						maxScreenW: _options.maxScreenW ?? 1180,
						minValue,
						maxValue,
					});
				},
				{
					autocomplete: "~(m|mx|my|mt|mr|mb|ml|p|px|py|pt|pr|pb|pl|text|gap)-<num>/<num>",
				},
			],
		],
		// Customize your variants here
		variants: [
			{
				name: "@active",
				match(matcher) {
					if (!matcher.startsWith("@active")) return matcher;

					return {
						matcher: matcher.slice(8),
						selector: (s) => `${s}.active`,
					};
				},
			},
		],
		shortcuts: [
			[
				// biome-ignore lint/nursery/noUselessEscapeInRegex: <explanation>
				/^(?<category>list|col|row|grid|fill|font|text|bg|border|stroke|outline|underline|ring|divide)-\[(?<css>[\/!@\-\w:[\]]+,[\/!@\-\w,:[\]]+(?<!,))\]$/,
				(match) => {
					const category = matchFromRegex<Category>(match, "category");
					const stringElement = matchFromRegex<string>(match, "css");

					//console.log(tailwindKiller3(category, stringElement));
					return tailwindKiller3(category, stringElement);
				},
			],
		],
	};
});

export default presetWindPlus;
