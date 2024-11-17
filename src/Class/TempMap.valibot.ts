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
    v.regex(
      /^\[[@\w:-]+\]$|[@\w:-]+$/,
      "Must be a no regex like [string]|string"
    ),
    v.transform((noRegexStr) => setOfNORegex.add(noRegexStr))
  ),
  convertToArray: v.pipe(
    v.set(
      v.pipe(
        v.string("must be a string inside the Set Please"),
        v.regex(
          /^\[[@\w:-]+\]$|[@\w:-]+$/,
          "Must be a no regex like string:[string]"
        )
      )
    ),
    v.transform((e) => Array.from(e, (e) => e.split(":")))
  ),
};

const isRegex = v.undefinedable(
  v.pipe(
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
  ),
  "must be a string inside the Set Please"
);

export function init(Initial: Set<string>): Set<string> {
  setOfNORegex.clear();
  for (const iterator of Initial) {
    v.parse(v.union([isRegex, NoRegex.addToSet]), iterator);
  }
  console.log({
    setOfNORegex,
  });

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
      console.log({ value, key });

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

const firstString = v.fallback(
  v.pipe(
    v.string("must be a string inside firstString"),
    v.regex(/.*[,]+.+/g, "coma is missing in regex")
  ),
  "error firstString"
);
// /////////////////////////////////////////////
/**
 * MARK: function builder
 */
// /////////////////////////////////////////////
const processString = (x: string): Set<string> => {
  const X = v.safeParse(firstString, x);
  try {
    const Initial = splitString(X.output as string);

    init(Initial);
    return setOfNORegex;
  } catch (error) {
    if (error instanceof v.ValiError) {
      console.error(error.issues);
      console.error(error.cause);
    }
    return new Set<string>(["error #1"]);
  }
};

function tailwindKiller2(category: Category, value: string): string {
  const setElement = processString(value);
  const arrayOf = v.parse(NoRegex.convertToArray, setElement);
  try {
    arrayOf.map((e) => {
      e.splice(e.length - 1, 0, category);
      console.log(e);
      return e;
    });
    console.log(arrayOf);
    
    const mergeBeforeCss = arrayOf
      .flatMap((Element) => {
        const Before = Element.slice(0, -1).join(":");
        const CatCss = Element.pop();
        return `${Before}-${CatCss}`;
      })
      .join(" ");

    return mergeBeforeCss;
  } catch (error) {
    if (error instanceof v.ValiError) {
      console.error(error.issues);
      console.error(error.cause);
    }
    return "error tailwind killer2";
  }
}
export default tailwindKiller2;

//const f = tailwindKiller2("text", "1,,2,orange,3xl,md:hover:pink");
//console.log(f);
 