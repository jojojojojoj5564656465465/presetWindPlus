import { createGenerator } from "@unocss/core";
import { expect, it } from "vitest";
import { presetWindPlus } from "../src";

it("presetWindPlus", async () => {
	const uno = await createGenerator({
		presets: [presetWindPlus()],
	});
	const presets = uno.config.presets;
	expect(presets).toHaveLength(1);

	const { css } = await uno.generate("px-9-6");

	expect(css).toMatchInlineSnapshot(`""`);
});