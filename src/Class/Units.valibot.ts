import * as v from "valibot";

const convertToRem = v.pipe(
  v.string(),
  v.trim(),
  v.transform(Number),
  v.number("convert to rem only accept number into a string"),
  v.transform((el) => el / 4),
  v.transform((el) => Math.round(el)),
  v.transform((el) => `${el}rem`)
);

const validateInput__Divide_NumByDenum = v.pipe(
  v.string(),
  v.nonEmpty("The string should contain at least one character."),
  v.includes("/", "must be fraction using ==> /"),
  v.regex(
    /^[1-9][0-9]{0,2}\/[1-9][0-9]{0,3}$/,
    "must be a Fraction like 1/2 or 5/9"
  ),
  v.transform((str) => str.split("/")),
  v.tuple([
    v.pipe(v.string(), v.transform(Number)),
    v.pipe(v.string(), v.transform(Number)),
  ]),
  v.transform((e) => (e[0] / e[1]) * 100),
  v.transform((e) => e.toFixed(3)),
  v.transform((digit) => `${digit}%`),
  v.description("check if array of 2 numbers and devide num/denum")
);

const size = {
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

} as const;

const valideObj = v.pipe(
  v.string(),
  v.custom<keyof typeof size>((input) =>
    !!Object.keys(size).find((e) => e === input)
  ),
  v.transform((e) => size[e])
);
const Brackets = v.pipe(
  v.string(),
  v.trim(),
  v.startsWith("["),
  v.endsWith("]"),
  v.regex(/^\[(?<valueInsideBrakets>[\d\w\.%]{2,})\]$/),
  v.transform((e) => e.match(/^\[(?<valueInsideBrakets>[\d\w\.%]{2,})\]$/)),
  v.transform((e) => e?.[1])
);


const caseSwitch = v.nonNullish(v.nullish(
  v.union([
    convertToRem,
    valideObj,
    validateInput__Divide_NumByDenum,
    Brackets,
  ]),
),"0in")

const UnitProcess = v.parser(caseSwitch) ;

export default UnitProcess;
