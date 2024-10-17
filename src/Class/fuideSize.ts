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

export function fluidType(options: FluidTypeOptions): {
  [key: string]: string;
} {
  const { category, minVw, maxVw, minValue, maxValue } = options;
  const limitScreenSize = pipe(number(), max(1680), min(300));
  const valibotLimitScreenSize = parser(limitScreenSize);

  valibotLimitScreenSize(maxVw);
  valibotLimitScreenSize(minVw);

  // Convert all values to rem
  const minValueRem = toTailwindUnitsBy4(minValue);
  const maxValueRem = toTailwindUnitsBy4(maxValue);
  const minVwRem = minVw / 16;
  const maxVwRem = maxVw / 16;

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
