import * as v from "valibot";
import { splitString } from "../nestingRules/utils";

/**
 * @description Map of regex use to do the process
 */
const mapRegex = new Map<string, Set<string>>();
const setOfNORegex = new Set<string>();

/**
 * @description when a string is not a regex it is added to the set
 * then the set is transformed in an array when Set is FULL
 * @MARK: NO Regex
 */
const NoRegex = {
  addToSet: v.pipe(
    v.string("must be a string inside the Set Please"),
    v.regex(/^\[?[@\w:-]+\]*$/, "Must be a no regex like string:[string]"),
    v.transform((noRegexStr) => setOfNORegex.add(noRegexStr))
  ),
  convertToArray: v.pipe(
    v.set(
      v.pipe(
        v.string("must be a string inside the Set Please"),
        v.regex(/^\[?[@\w:-]+\]*$/, "Must be a no regex like string:[string]")
      )
    ),
    v.transform((e) => Array.from(e)),
    v.mapItems((e) => e.split(":")),
    v.minLength(1)
  ),
};

const isRegex = v.pipe(
  v.string("must be a string inside the Set Please"),
  v.custom<Regex>((input) =>
    typeof input === "string"
      ? /(?<before>^[@?\w:]+):\[(?<css>[%/@\-\w:,[\]]+)\]$/.test(input)
      : false
  ),
  v.transform((isRegexStr) => {
    const match = isRegexStr.match(
      /(?<before>^[@?\w:]+):\[(?<css>[%/@\-\w:,[\]]+)\]$/
    );
    const before = v.parse(
      v.string("before is not string type"),
      match?.groups?.before
    );
    const css = v.parse(
      v.string("css is not a string type"),
      match?.groups?.css
    );
    mapRegex.set(before, splitString(css));
  }),
  v.transform(processMapDoWhile)
);

export function init(Initial: Set<string>): Set<string> {
  for (const iterator of Initial) {
    v.parse(v.union([isRegex, NoRegex.addToSet]), iterator);
  }
  Initial.clear();
  processMapDoWhile();
  return setOfNORegex;
}

function processMapDoWhile(): void {
  let iteration = 0;
  while (mapRegex.size > 0 && iteration < 6) {
    iteration++;
    const TempSet = new Set<string>();
    mapRegex.forEach((value, key) => {
      for (const iterator of value) {
        TempSet.add(`${key}:${iterator}`);
      }
    });
    mapRegex.clear();
    for (const element of v.parse(
      v.set(v.string("must be a string inside the TempSet")),
      TempSet
    )) {
      v.parse(v.union([isRegex, NoRegex.addToSet]), element);
    }
  }
}

// /////////////////////////////////////////////
/**
 * MARK: fonction builder
 */
// /////////////////////////////////////////////

const processString = (x: string): Set<string> => {
  const X = v.parse(v.string("must be string in processString"), x);
  const Initial = splitString(X);
  init(Initial);
  return setOfNORegex;
};

function p(category: string, value: string): string {
  const setElement = processString(value);
  const arrayOf = v.parse(NoRegex.convertToArray, setElement);
  arrayOf.map((e) => {
    if (e.length > 1) {
      e.splice(e.length - 1, 0, category);
    } else {
      e.push(category);
    }
    return e;
  });
  const mergeBeforeCss = arrayOf
    .flatMap((Element) => {
      const Before = Element.slice(0, -1).join(":");
      const CatCss = Element.pop();
      return `${Before}-${CatCss}`;
    })
    .join(" ");

  return mergeBeforeCss;
}
export default p;
