import { defineConfig } from "unocss";
//import presetWind4 from "@unocss/preset-wind4";
import presetWindPlus from "./src";

export default defineConfig({
	presets: [presetWindPlus({ maxScreenW: 1150, minScreenW: 320 })],
});
