import { defineConfig } from 'unocss'
import presetWindPlus  from './src'

// Just for Vscode Extension

export default defineConfig({
  presets: [

		presetWindPlus(),
  ],
})
