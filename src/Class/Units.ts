import { matchFromRegex } from "../utils";

import * as v from "valibot";

type Element = string | `${number}` | Size | Regex;



// const valideObj = v.pipe(
//   v.string(),
//   v.custom<keyof typeof size>((input) =>
//     Object.keys(size).find((e) => e === input) ? true : false
//   ),
//   v.transform((e) => size[e])
// );



const Brackets = v.pipe(
  v.string(),
  v.startsWith("["),
  v.endsWith("]"),
  v.regex(/^\[(?<valueInsideBrakets>[\d\w\.%]{2,})\]$/),
  v.transform((e) => e.match(/^\[(?<valueInsideBrakets>[\d\w\.%]{2,})\]$/)),
  v.transform((e) => e?.pop())
);



/**
 * This is a description of the MyClass constructor function.
 * @class Fonction
 * @classdesc Functions for All units process in Index.ts
 * @property {string} name - The name of the function.
 */
class Fonction {

  convertToRem(x: string): string {
    const convert = v.fallback(
      v.pipe(
        v.string(),
        v.transform(Number),
        v.number('convert to rem only accept number into a string'),
        v.transform((el) => el / 4),
        v.transform((el) => el.toFixed(2)),
        v.transform((el) => `${el}rem`)
      ),
      "0in"
    );

    return v.parse(convert, x);
  }
  
  fractionPourcentageGenerator = (x: `${string}/${string}`): string => {
      const validateInput__Divide_NumByDenum = v.fallback(
        v.pipe(
          v.string(),
          v.nonEmpty("The string should contain at least one character."),
          v.includes("/", "must be fraction using ==> /"),
          v.regex(
            /^[1-9][0-9]{0,2}\/[1-9][0-9]{0,3}$/,
            "must be a Fraction like 1/2 or 5/9"
          ),
          v.transform((str) => str.split("/")),
          v.strictTuple([
            v.pipe(v.string(), v.transform(Number), v.toMinValue(1)),
            v.pipe(v.string(), v.transform(Number), v.toMinValue(1)),
          ]),
          v.transform((e) => (e[0] / e[1]) * 100),
          v.transform((e) => e.toFixed(2)),
          v.transform((digit) => `${digit}%`),
          v.description("check if array of 2 numbers and devide num/denum")
        ),
        "0%"
      );


    return v.parse(validateInput__Divide_NumByDenum, x);
    //return v.parse(NumberSchema, array);
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
   
    const franctionP = v.pipe(
      v.string(),
      v.nonEmpty("The string should contain at least one character."),
      v.includes("/", "must be fraction using ==> /"),
      v.regex(
        /^[1-9][0-9]{0,2}\/[1-9][0-9]{0,3}$/,
        "must be a Fraction like 1/2 or 5/9"
      ),
      v.transform((str) => str.split("/")),
      v.tuple([
        v.pipe(v.string(), v.transform(Number), v.toMinValue(1)),
        v.pipe(v.string(), v.transform(Number), v.toMinValue(1)),
      ])
    );

    return v.is(franctionP, x);
  }

  regex = {
    // biome-ignore lint/complexity/useRegexLiterals: <explanation>
    Braket: new RegExp("^\\[(?<insideBrakets>\\w+)\\]"),

    // biome-ignore lint/complexity/useRegexLiterals: <explanation>
    valideInsideBraket: new RegExp("^\\d+\\w+$"),

    octobreRegex :/^\[(?<valueInsideBrakets>[\d\w\.%]{2,})\]$/
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
        this.el = this.fractionPourcentageGenerator(
          this.el as `${string}/${string}`
        );


      } else if (this.insideBraketP()) {
        const match = this.el.match(this.regex.Braket) as RegExpMatchArray;
        const groups = matchFromRegex<string>(match, "insideBrakets");
        this.el = this.valideinsideBraket(groups)
          ? groups
          : "error-insid-brakets";
      } else {
        this.el = "error size";
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default UnitArray;

