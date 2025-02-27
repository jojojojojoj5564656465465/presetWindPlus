import * as v from "valibot";
import { dicoMatch, dictionaryCheckAndTransform, type tailwindClasses } from "../utils";

interface FluidTypeOptions {
	category: keyof typeof tailwindClasses;
	minScreenW: number;
	maxScreenW: number;
	minValue: number;
	maxValue: number;
}

/**
 * ! je crians que la formule n'est pas bonne de la slope
 * ? je ne sais pas si je peux faire une formule plus simple
 * @param options 
 * 
 * @returns 
 */
function fluidType(options: FluidTypeOptions) {
	const limitScreenSizeVW = v.pipe(
		v.number("number only for screen Size props"),
		v.maxValue(1680, "maxVw should be less than 1680"),
		v.minValue(300, "minVw should be more than 300"),
		v.transform((num) => num / 16),
		v.description("check la taille min et max & divide by 16 to convert into px"),
	);

	const valueRem = v.pipe(
		v.number("must be a number"),
		v.minValue(0.5, "min value must be more than 0.5 in valueRem"),
		v.transform((num) => num / 4),
		v.description("convert to tailwind size unit")
	);

	const SimpleObjectSchema = v.pipe(
		v.object({
			category: dictionaryCheckAndTransform,
			maxValue: valueRem,
			minValue: valueRem,
			maxScreenW: limitScreenSizeVW,
			minScreenW: limitScreenSizeVW,
		}),
		v.partialCheck([["maxScreenW"], ["minScreenW"]], (input) => input.minScreenW < input.maxScreenW, "maxVwRem is less than minScreenW invert data"),
		v.partialCheck([["maxValue"], ["minValue"]], (input) => input.minValue < input.maxValue, "maxVwRem is less than minValueRem invert data"),
	);
	try {
		const { maxValue, minValue, maxScreenW, minScreenW } = v.parse(SimpleObjectSchema, options);
		const slope = (maxValue - minValue) / (maxScreenW - minScreenW);
		const yIntercept = minValue - minScreenW * slope;

		const fluidValue = `${yIntercept.toFixed(2)}rem + ${(slope * 100).toFixed(2)}vw`;
		// Generate the clamp value
		const clampValue = `clamp(${minValue.toFixed(5)}rem, ${fluidValue}, ${maxValue.toFixed(2)}rem)`;

		return {
			[dicoMatch(options.category)]: clampValue,
		};
	} catch (error) {
		if (error instanceof v.ValiError) {
			console.error("error Valibot fluidSize", error.issues);
			console.error(error.cause);
		}
		console.error("error in fluidSize not Valibot issue", error);
	}
}

export default fluidType;
