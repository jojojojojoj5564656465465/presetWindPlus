import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	entries: ["src/index"],
	clean: true,
	declaration: true,
	externals: ["@unocss/core"],
	rollup: {
		dts: {
			respectExternal: false,
		},
	},
});