import { isWindows } from "std-env";
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	entries: ["src/index"],
	clean: true,
	declaration: true,
	rollup: {
		// emitCJS: true,
		dts: {
			respectExternal: false,
		},
	},
	failOnWarn: !isWindows,
});
