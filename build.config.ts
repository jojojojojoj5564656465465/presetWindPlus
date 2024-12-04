import process from "node:process";
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	entries: ["src/index"],
	clean: true,
	declaration: true,
	rollup: {
		emitCJS: true,
		esbuild: {
			minify: process.env.NODE_ENV === "production",
		},
		dts: {
			respectExternal: false,
		},
		inlineDependencies: true,
	},
	//failOnWarn: false,
});
