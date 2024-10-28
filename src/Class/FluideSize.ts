import {
  pipe,
  number,
  parse,
maxValue as max,
  type InferOutput,
  parser,
  nonNullable,
  minValue as min,
} from "valibot";

const tailwindClasses = {
  m: "margin",
  mx: "margin-inline",
  my: "margin-block",
  mt: "margin-block-start",
  mr: "margin-inline-end",
  mb: "margin-block-end",
  ml: "margin-inline-start",
  p: "padding",
  px: "padding-inline",
  py: "padding-block",
  pt: "padding-block-start",
  pr: "padding-inline-end",
  pb: "padding-block-end",
  pl: "padding-inline-start",
  text: "font-size",
  gap: "gap",
  w: "width",
  h: "height",
  border: "border-width",
  outline: "outline-width",
} as const;

type TailwindClass = keyof typeof tailwindClasses;

interface FluidTypeOptions {
  category: TailwindClass;
  minVw: number;
  maxVw: number;
  minValue: number;
  maxValue: number;
}
const numberArg = pipe(number(), min(1), nonNullable(number()));

function toTailwindUnitsBy4(px: number): InferOutput<typeof numberArg> {
  parse(numberArg, px);
  return px / 4;
}

function fluidType(options: FluidTypeOptions): {
  [key: string]: string;
} {
  const { category, minVw, maxVw, minValue, maxValue } = options;
  const limitScreenSize = pipe(number('number only for screen Size props'), max(1680,"maxVw should be less than 1680"), min(300,"minVw should be more than 300"));
  const valibotLimitScreenSize = parser(limitScreenSize);



  // Convert all values to rem
  const minValueRem = toTailwindUnitsBy4(minValue);
  const maxValueRem = toTailwindUnitsBy4(maxValue);
  const minVwRem = valibotLimitScreenSize(minVw) / 16;
  const maxVwRem = valibotLimitScreenSize(maxVw) / 16;

  // Validate input options
  if (minVwRem >= maxVwRem || minValueRem >= maxValueRem) {
    throw new Error(
      "Invalid input options: min values should be less than max values"
    );
  }

  // Calculate the slope and y-intercept
  const slope = (maxValueRem - minValueRem) / (maxVwRem - minVwRem);
  const yIntercept = minValueRem - minVwRem * slope;

  // Generate the fluid value
  const fluidValue = `${yIntercept.toFixed(4)}rem + ${(slope * 100).toFixed(
    4
  )}vw`;

  // Generate the clamp value
  const clampValue = `clamp(${minValueRem.toFixed(
    5
  )}rem, ${fluidValue}, ${maxValueRem.toFixed(5)}rem)`;

  // Return the CSS string with the clamp value
  return { [tailwindClasses[category]]: clampValue };
}
export default fluidType;









const limitScreenSizeVW = v.pipe(
  v.number("number only for screen Size props"),
  v.maxValue(1680, "maxVw should be less than 1680"),
  v.minValue(300, "minVw should be more than 300"),
  v.transform((num) => num / 16),
  v.description(
    "vérifier la taille min et max & devide by 16 to convert into px"
  )
);

const vwConverter = v.parser(limitScreenSizeVW);

const valueRem = v.pipe(
  v.number("must be a number"),
  v.minValue(1),
  v.transform((num) => num / 4)
);

const toTailwindUnitsBy4 = v.parser(valueRem);

const obj = {
  maxValueRem: 18,
  minValueRem: 1,
  maxVwRem: 1200,
  minVwRem: 350,
};
const SimpleObjectSchema = v.object({
  maxValueRem: valueRem,
  minValueRem: valueRem,
  maxVwRem: limitScreenSizeVW,
  minVwRem: limitScreenSizeVW,
});

const Shema_minmaxCompareAndTransform = v.pipe(
  v.strictTuple([v.number(), v.number()]),
  v.check((arr) => arr[0] < arr[1], "max must be above min"),
  v.transform((arr) => arr[1] - arr[0])
);
const minmaxCompareAndTransformP = v.parser(Shema_minmaxCompareAndTransform);

const { maxValueRem, minValueRem, maxVwRem, minVwRem } = v.parse(
  SimpleObjectSchema,
  obj
);

const slope =
  minmaxCompareAndTransformP([minValueRem, maxValueRem]) /
  minmaxCompareAndTransformP([minVwRem, maxVwRem]);
const yIntercept = minValueRem - minVwRem * slope;

const fluidValue = `${yIntercept.toFixed(4)}rem + ${(slope * 100).toFixed(
  4
)}vw`;

console.log(fluidValue);

