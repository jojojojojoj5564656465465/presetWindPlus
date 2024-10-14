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
};

interface FluidTypeOptions {
  category: keyof typeof tailwindClasses;
  minVw: number;
  maxVw: number;
  minValue: number;
  maxValue: number;
  unit?: "px" | "rem"; // Optional unit conversion
}

export function fluidType(options: FluidTypeOptions): string {
  const { minVw, maxVw, minValue, maxValue, unit = "rem" } = options;
  const valueRem = {
    min: minValue / 4,
    max: maxValue / 4,
  };
  // Validate input options
  if (minVw >= maxVw || minValue >= maxValue) {
    throw new Error("Invalid input options");
  }

  // Calculate the slope of the line that represents the fluid value
  const slope = (valueRem.max - valueRem.min) / (maxVw - minVw);

  // Calculate the y-intercept of the line
  const yIntercept = valueRem.min - minVw * slope;

  // Generate the fluid value using the slope and y-intercept
  const fluidValue = `${yIntercept}${unit} + ${100 * slope}svw`;

  // Generate the clamp value using the minimum, fluid, and maximum values
  const clampValue = `clamp(${valueRem.min}${unit}, ${fluidValue}, ${valueRem.max}${unit})`;

  // Return the CSS string with the fallback and clamp values
  return `${tailwindClasses[options.category]}: ${clampValue};`;
}


