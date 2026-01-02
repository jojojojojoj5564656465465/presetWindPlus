import presetWind4 from "@unocss/preset-wind4";
import { defineConfig } from "unocss";
import { presetWindPlus } from "./src";

export default defineConfig({
	presets: [presetWind4() as any, presetWindPlus({ maxScreenW: 1150, minScreenW: 320 }) as any],
});
