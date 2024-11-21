import { describe, expect, it } from "vitest";
import {
  splitInsideBrakets,
  splitString,
  removeDuplicates,
  BuildTailwindKiller,
  dictionaryParser,
} from "./utils";

describe("splitInsideBrakets", () => {
  it("should return an array of arrays when input is a string with commas and colons", () => {
    const input = "a:b,c:d";
    const expectedOutput = [
      ["a", "b"],
      ["c", "d"],
    ];
    expect(splitInsideBrakets(input)).toEqual(expectedOutput);
  });

  it("should return an array with a single element when input is a string without commas and colons", () => {
    const input = "a";
    const expectedOutput = [["a"]];
    expect(splitInsideBrakets(input)).toEqual(expectedOutput);
  });

  it("should log an error when input is a string with invalid syntax", () => {
    const input = "a[b]";
    const consoleErrorSpy = vi.spyOn(console, "error");
    splitInsideBrakets(input);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });
});

describe("splitString", () => {
  it("should return a set of strings when input is a string with commas", () => {
    const input = "a,b,c";
    const expectedOutput = new Set(["a", "b", "c"]);
    expect(splitString(input)).toEqual(expectedOutput);
  });

  it("should return a set with a single element when input is a string without commas", () => {
    const input = "a";
    const expectedOutput = new Set(["a"]);
    expect(splitString(input)).toEqual(expectedOutput);
  });

  it("should ignore brackets when splitting the string", () => {
    const input = "a[b],c";
    const expectedOutput = new Set(["a[b]", "c"]);
    expect(splitString(input)).toEqual(expectedOutput);
  });
});

describe("removeDuplicates", () => {
  it("should return an array without duplicates when input is an array with duplicates", () => {
    const input = ["a", "b", "a", "c"];
    const expectedOutput = ["a", "b", "c"];
    expect(removeDuplicates(input)).toEqual(expectedOutput);
  });

  it("should return the original array when input is an array without duplicates", () => {
    const input = ["a", "b", "c"];
    const expectedOutput = ["a", "b", "c"];
    expect(removeDuplicates(input)).toEqual(expectedOutput);
  });
});

describe("BuildTailwindKiller", () => {
  it("should return a string with the category and CSS classes when input is a set of strings", () => {
    const input = new Set(["a:b", "c:d"]);
    const category = "test";
    const expectedOutput = "a-test-b c-test-d";
    const buildTailwindKiller = new BuildTailwindKiller(category, input);
    expect(buildTailwindKiller.build).toEqual(expectedOutput);
  });
});

describe("dictionaryParser", () => {
  it("should return the transformed value when input is a key in the dictionary", () => {
    const input = "px";
    const expectedOutput = "padding-inline";
    expect(dictionaryParser(input)).toEqual(expectedOutput);
  });

  it("should throw an error when input is not a key in the dictionary", () => {
    const input = " invalid";
    expect(() => dictionaryParser(input)).toThrowError();
  });
});
