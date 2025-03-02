import { defineConfig, presetWind3 } from "unocss";
import presetWindPlus from "./src";



export default defineConfig({
	presets: [
		presetWindPlus({ maxScreenW: 1150, minScreenW: 320 }),
		 presetWind3()
		],
});
