import { defineConfig, presetWind } from "unocss";
import presetWindPlus from './src'

// Just for Vscode Extension

export default defineConfig({
  presets: [
    presetWind(),
    presetWindPlus({
      maxScreenW:1150,
      minScreenW:320,
    }),
  ],
})
