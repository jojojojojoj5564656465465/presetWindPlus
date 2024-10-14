import { definePreset } from "@unocss/core";

import {
  convertUnitFromArray,
  elementFromDictionary,
  matchFromRegex,
  removeDuplicateArrayPaddingOrMargin,
} from "./utils";

import { AllUnitsHandler, UnitArray } from "./Class";
import tailwindKiller from "./netingRules/tailwindKiller";
import { fluidType } from "./Class/fuideSize";
const presetWindPlus = definePreset(() => {
  return {
    name: "presetWindPlus",
    // Customize your preset here
    rules: [
      [
        /^flex\|(?<grow>\d+)?\|(?<shrink>\d+)?\|?(\d+|\[\w+\]|auto)?$/,
        (match) => {
          const [, grow = 1, shrink = 0, basis] = match as [
            unknown,
            number,
            number,
            string | "auto"
          ];
          if (basis) {
            const basisClass = new UnitArray(basis);
            basisClass.numberRemOrString();
            return {
              flex: `${grow} ${shrink} ${basisClass.el}`,
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
          } as const satisfies Record<
            typeof flexNumber,
            readonly [PositionProps, PositionProps]
          >;
          const display = flex === "inline-flex" ? "inline flex" : "block flex";
          const columORrow = direction === "row" ? "row" : "column";
          const [justify, align] = positions[flexNumber];
          return {
            display,
            "flex-direction": columORrow,
            "justify-content": justify,
            "align-items": align,
          };
        },
        { autocomplete: "flex-(col|row)-(1|2|3|4|5|6|7|8|9)" },
      ],
      [
        /^(?<direction>p|m|inset)-(\w+\.?\/?\d?|\[\d+(?:\w+|%)\])?-?(\w+\.?\/?\d?|\[\d+(?:\w+|%)\])?-?(\w+\.?\/?\d?|\[\d+(?:\w+|%)\])?-?(\w+\.?\/?\d?|\[\d+(?:\w+|%)\])?$/,
        (match) => {
          const direction = matchFromRegex<"p" | "m" | "inset">(
            match,
            "direction"
          );
          const ClassArrayOfUnits = new AllUnitsHandler(match, 4, false);
          const array = convertUnitFromArray(ClassArrayOfUnits.returnArray);
          const combination = {
            p: "padding",
            m: "margin",
            inset: "inset",
          } as const satisfies Record<typeof direction, string>;
          const returnDirection = elementFromDictionary(combination, direction);
          const arrayWithoutDuplicate =
            removeDuplicateArrayPaddingOrMargin(array);
          return { [returnDirection]: arrayWithoutDuplicate.join(" ") };
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
          const direction = matchFromRegex<keyof typeof combination>(
            match,
            "direction"
          );
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
          } as const satisfies Record<"x" | "y", string>;

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
          const array = convertUnitFromArray(ClassArrayOfUnits.returnArray);
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
        (
          match
        ): Record<
          "margin-trim",
          | "inline"
          | "block"
          | "block-start"
          | "block-end"
          | "inline-start"
          | "inline-end"
        >[] => {
          const s = matchFromRegex<"mx" | "my" | "mt" | "mb" | "ml" | "mr">(
            match,
            "direction"
          );
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
          const returnArr: string[] = [
            "-webkit-writing-mode",
            "-ms-writing-mode",
            "writingMode",
          ];
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
    ],
    shortcuts: [
      [
        /^(?<category>list|col|row|grid|fill|font|text|bg|border|stroke|outline|underline|ring|divide)-\[(?<css>[/!@\-\w:,[\]]+)\]/,
        (match) => {
          const category = matchFromRegex<Category>(match, "category");
          const stringElement = matchFromRegex<string>(match, "css");
          return tailwindKiller(category, stringElement);
        },
      ],
      [
        /^~(?<category>m|mx|my|mt|mr|mb|ml|p|px|py|pt|pr|pb|pl|text|gap|w|h|border|outline)-(?<minValue>\d+)\/(?<maxValue>\d+)$/,
        (match) => {
          const category = matchFromRegex<
            | "m"
            | "mx"
            | "my"
            | "mt"
            | "mr"
            | "mb"
            | "ml"
            | "p"
            | "px"
            | "py"
            | "pt"
            | "pr"
            | "pb"
            | "pl"
            | "text"
            | "gap"
            | "w"
            | "h"
            | "border"
            | "outline"
          >(match, "category");
          const minValue = +matchFromRegex<string>(match, "minValue");
          const maxValue = +matchFromRegex<string>(match, "maxValue");
          return fluidType({
            category,
            minVw: 320,
            maxVw: 1180,
            minValue,
            maxValue,
          });
          //return [`${category}-${small}`, `lg:${category}-${big}`].join(" ");
        },
        {
          autocomplete:
            "~(m|mx|my|mt|mr|mb|ml|p|px|py|pt|pr|pb|pl|text|gap)-<num>/<num>",
        },
      ],
    ],
  };
});

export default presetWindPlus;
