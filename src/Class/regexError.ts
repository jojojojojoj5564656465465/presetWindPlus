export class RegexError extends Error {
  regex: RegExp;
  match: RegExpMatchArray | null;
  default: string;

  constructor(parameters: string, regex: RegExp, input: string) {
    super(parameters);
    this.regex = regex;
    this.match = input.match(this.regex);
    this.default = "RegexError";
  }
}
