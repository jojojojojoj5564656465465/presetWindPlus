import { expect, test } from "vitest";

test("Remove direction in array match A", () => {
  const inputArray = [{ match: "A" }, { match: "B" }, { match: "C" }];
  removeDirectionInArray(inputArray);
  expect(inputArray).toEqual([{ match: "A" }, { match: "C" }]);
});
