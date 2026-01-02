import { expect, test } from "vitest";
import { removeDirectionInArray } from "../src/utils";

test("Remove direction in array match A", () => {
	const inputArray = [{ match: "A" }, { match: "B" }, { match: "C" }] as any;
	removeDirectionInArray(inputArray);
	expect(inputArray).toEqual([{ match: "A" }, { match: "C" }]);
});
