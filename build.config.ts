import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	entries: [
		{
			input: "src/index",
			name: "index",
			declaration: true,
			esbuild: {
				target: "es2022",
			},
		},
	],
	clean: true,
	declaration: true,
	rollup: {
		emitCJS: true,
		cjsBridge: true,
	},
	externals: ["unocss"],
});
