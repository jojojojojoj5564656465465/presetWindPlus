import { definePreset } from "@unocss/core";
import UnitProcess from "./utilsFN/Units";

import * as v from "valibot";

import { elementFromDictionary, matchFromRegex, matchFromRegexString, matchFromRegexV, myUnits } from "./utils";

import { DictionaryParser, FluidSize, fromMatchRemoveDuplicate, tailwindKiller } from "./utilsFN";

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

		rules: [
			[
				new RegExp(`^flex\\|(?<grow>\\d)\\|(?<shrink>\\d)(?:\\|(?<basisRegex>${myUnits.source}))?$`),
				(match) => {
					const grow = matchFromRegex<number>(match, "grow");
					const shrink = matchFromRegex<number>(match, "shrink");
					const basis = v.safeParser(v.pipe(v.string("basis must be string"), v.transform(UnitProcess), v.description("if basis is here transform it and return it")));
					const basisParser = basis(match.groups?.basisRegex);
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
					const flex = matchFromRegexV(match, "flex", ["inline-flex", "flex"]);
					const direction = matchFromRegexV(match, "direction", ["row", "col"]);
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
						display: display,
						"flex-direction": columnORrow,
						"justify-content": justify,
						"align-items": align,
					};
				},
				{ autocomplete: "flex-(col|row)-(1|2|3|4|5|6|7|8|9)" },
			],
			[
				new RegExp(`^(?<direction>p|m|inset)-(?<allUnitsRegex>${myUnits.source}-${myUnits.source}-?${myUnits.source}?-?${myUnits.source}?$)`),
				(match) => {
					try {
						const returnDirection = DictionaryParser(match?.groups?.direction);
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
				new RegExp(`(?<direction>^(?:p|m)(?:x|y)|gap)-(?<allUnitsRegex>${myUnits.source}-${myUnits.source}$)`),
				(match) => {
					try {
						const returnDirection = DictionaryParser(match?.groups?.direction);
						//* UNITS
						const arrMatch = v.safeParse(fromMatchRemoveDuplicate(2, true), match?.groups?.allUnitsRegex);

						if (arrMatch.success) {
							return { [returnDirection]: arrMatch.output.join(" ") };
						}
						console.error("\n ERROR UNOCSS code:#59 => px my gap", arrMatch.issues);
						return { [returnDirection]: "0in" };
					} catch (error) {
						if (error instanceof v.ValiError) {
							console.error("ERROR UNOCSS code:#59 => px my gap", error.issues[0].message);
						}
					}
				},
				{ autocomplete: "(gap|px|py|mx|my)-<num>-<num>" },
			],

			[
				new RegExp(`^inset-(?<direction>x|y)-(?<allUnitsRegex>${myUnits.source}-${myUnits.source}$)`),
				(match) => {
					const directionParser = v.parser(v.pipe(v.string(), v.picklist(["x", "y"])));
					const direction = directionParser(match.groups?.direction);
					const combination = {
						x: "inset-inline",
						y: "inset-block",
					} as const satisfies Record<"x" | "y", `inset-${string}`>;

					try {
						const returnDirection = elementFromDictionary(combination, direction);
						//* UNITS
						const arrMatch = v.safeParse(fromMatchRemoveDuplicate(2, true), match?.groups?.allUnitsRegex);

						if (arrMatch.success) {
							return { [returnDirection]: arrMatch.output.join(" ") };
						}
						console.error("\n ERROR UNOCSS code:#60 => inset-x-6", arrMatch.issues);
						return { [returnDirection]: "0in" };
					} catch (error) {
						if (error instanceof v.ValiError) {
							console.error("ERROR UNOCSS code:#60 => inset-x-6", error.issues[0].message);
						}
					}
				},
				{ autocomplete: "inset-(x|y)-<num>-<num>" },
			],
			[
				new RegExp(`^gap-(?<direction>x|y)-(?<allUnitsRegex>${myUnits.source}$)`),
				(match) => {
					const directionParser = v.parser(v.pipe(v.string(), v.picklist(["x", "y"])));
					const direction = directionParser(match.groups?.direction);

					const combination = {
						x: "column-gap",
						y: "row-gap",
					} as const satisfies Record<typeof direction, string>;

					try {
						const returnDirection = elementFromDictionary(combination, direction);
						//* UNITS
						const arrMatch = v.safeParse(fromMatchRemoveDuplicate(1, true), match?.groups?.allUnitsRegex);

						if (arrMatch.success) {
							return { [returnDirection]: arrMatch.output.join(" ") };
						}
						console.error("\n ERROR UNOCSS code:#61 => gap-x-6", arrMatch.issues);
						return { [returnDirection]: "0in" };
					} catch (error) {
						if (error instanceof v.ValiError) {
							console.error("ERROR UNOCSS code:#61 => gap-x-6", error.issues[0].message);
						}
					}
				},
				{ autocomplete: "gap-(x|y)-<num>" },
			],

			[
				new RegExp(`^size-(?<allUnitsRegex>${myUnits.source}-?${myUnits.source}?$)`),
				(match) => {
					try {
						//* UNITS
						const arrMatch = v.safeParse(fromMatchRemoveDuplicate(2, true), match?.groups?.allUnitsRegex);

						if (arrMatch.success) {
							if (arrMatch.output[0] !== undefined) {
								return [
									{
										"block-size": arrMatch.output[0],
										"inline-size": arrMatch.output[1] ?? arrMatch.output[0],
									},
								];
							}
						}
						console.error("\n ERROR UNOCSS code:#61 => size", arrMatch.issues);
						return { "block-size": "0in" };
					} catch (error) {
						if (error instanceof v.ValiError) {
							console.error("ERROR UNOCSS code:#58 => p m inset", error.issues[0].message);
						}
					}
				},
				{ autocomplete: "size-<num>-<num>" },
			],
			[
				/(?<direction>^m(?:(x|y|t|b|l|r)))-trim\b$/,
				(match) => {
					const direction = matchFromRegexV(match, "direction", ["mx", "my", "mt", "mb", "ml", "mr"]);

					const dictionary = {
						mx: "inline",
						my: "block",
						mt: "block-start",
						mb: "block-end",
						ml: "inline-start",
						mr: "inline-end",
					} as const satisfies Record<typeof direction, string>;
					const returnDirection = elementFromDictionary(dictionary, direction);
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
				([, rl_lr = "lr"]) => {
					const returnArr: string[] = ["-webkit-writing-mode", "-ms-writing-mode", "writingMode"];
					const result: Record<string, `vertical-${typeof rl_lr}`> = {};
					for (const e of returnArr) result[e] = `vertical-${rl_lr}`;
					return result;
				},
				{ autocomplete: "vertical-(rl|lr)" },
			],
			[
				/^grid-area-(?<str>[a-z]+)$/,
				(match) => {
					return {
						"grid-area": v.parse(v.string(), match?.groups?.str),
					};
				},
			],
			[
				/^~(?<category>m|mx|my|mt|mr|mb|ml|p|px|py|pt|pr|pb|pl|text|gap|w|h|border|outline)-(?<minValue>[1-9][0-9]*)\/(?<maxValue>[1-9][0-9]*)$/,
				(match) => {
					const category = matchFromRegex<"m" | "mx" | "my" | "mt" | "mr" | "mb" | "ml" | "p" | "px" | "py" | "pt" | "pr" | "pb" | "pl" | "text" | "gap" | "w" | "h" | "border" | "outline">(match, "category");
					const minValue = Number(matchFromRegexString(match, "minValue"));
					const maxValue = Number(matchFromRegexString(match, "maxValue"));
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
				/^(?<category>list|col|row|grid|fill|font|text|bg|border|stroke|outline|underline|ring|divide)-\[(?<css>[\/!.@\-\w:[\]]+,[\/!.@\-\w,:[\]]+(?<!,))\]$/,
				(match) => {
					const category = matchFromRegex<Category>(match, "category");
					const stringElement = matchFromRegex<string>(match, "css");
					const re = tailwindKiller(category, stringElement);
					//console.log(re);

					return re;
				},
			],
		],
	};
});

export default presetWindPlus;
