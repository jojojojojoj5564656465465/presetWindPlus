import * as v from "valibot";



const obj:FluidTypeOptions = {
  category:"px",
  maxValue: 18,
  minValue: 1,
  minScreenW: 322,
  maxScreenW: 1200,
};


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
  w: "inline-size",
  h: "block-size",
  border: "border-width",
  outline: "outline-width",
} as const satisfies Record<string, string>;

interface FluidTypeOptions {
  category: keyof typeof tailwindClasses;
  minScreenW: number;
  maxScreenW: number;
  minValue: number;
  maxValue: number;
}

function fluidType(options: FluidTypeOptions) {
  const dictionaryCheckAndTransform = v.pipe(
    v.string(),
    v.custom<keyof typeof tailwindClasses>(
      (input) =>
        // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
        (typeof input === "string" && tailwindClasses.hasOwnProperty(input)) ??
        false,
      "dictionaryCheckAndTransform did not find the element you wanted"
    ),
    v.transform((string) => tailwindClasses[string]),
    v.description("check if string is part of dictionary")
  );
  const keyReturn = v.parser(dictionaryCheckAndTransform);
  const limitScreenSizeVW = v.pipe(
    v.number("number only for screen Size props"),
    v.maxValue(1680, "maxVw should be less than 1680"),
    v.minValue(300, "minVw should be more than 300"),
    v.transform((num) => num / 16),
    v.description(
      "vérifier la taille min et max & devide by 16 to convert into px"
    )
  );

  const valueRem = v.pipe(
    v.number("must be a number"),
    v.minValue(0.5, "min value must be more than 0.5"),
    v.transform((num) => num / 4)
  );

  const SimpleObjectSchema = v.pipe(
    v.object({
      category: dictionaryCheckAndTransform,
      maxValue: valueRem,
      minValue: valueRem,
      maxScreenW: limitScreenSizeVW,
      minScreenW: limitScreenSizeVW,
    }),
    v.partialCheck(
      [["maxScreenW"], ["minScreenW"]],
      (input) => input.minScreenW < input.maxScreenW,
      "maxVwRem is less than minScreenW invert data"
    ),
    v.partialCheck(
      [["maxScreenW"], ["minScreenW"]],
      (input) => input.minScreenW < input.maxScreenW,
      "maxVwRem is less than minValueRem invert data"
    )
  );

  const { maxValue, minValue, maxScreenW, minScreenW } = v.parse(
    SimpleObjectSchema,
    options
  );
  const slope = (maxValue - minValue) / (maxScreenW - minScreenW);
  const yIntercept = minValue - minScreenW * slope;

  const fluidValue = `${yIntercept.toFixed(2)}rem + ${(slope * 100).toFixed(
    2
  )}vw`;
  // Generate the clamp value
  const clampValue = `clamp(${minValue.toFixed(
    5
  )}rem, ${fluidValue}, ${maxValue.toFixed(2)}rem)`;

  return {
    [keyReturn(options.category)]: clampValue,
  };
}
const result = fluidType(obj)


export default fluidType;