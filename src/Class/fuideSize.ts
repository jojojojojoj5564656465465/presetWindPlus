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
} as const satisfies Record<string, string>;

interface FluidTypeOptions {
  category: keyof typeof tailwindClasses;
  minVw: number;
  maxVw: number;
  minValue: number;
  maxValue: number;
}

function pxToRem(px: number): number {
  return px / 16;
}

export function fluidType(options: FluidTypeOptions): string {
  const { category, minVw, maxVw, minValue, maxValue } = options;

  // Convert all values to rem
  const minValueRem = pxToRem(minValue);
  const maxValueRem = pxToRem(maxValue);
  const minVwRem = pxToRem(minVw);
  const maxVwRem = pxToRem(maxVw);

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
    4
  )}rem, ${fluidValue}, ${maxValueRem.toFixed(4)}rem)`;

  // Return the CSS string with the clamp value
  return `${tailwindClasses[category]}: ${clampValue};`;
}
