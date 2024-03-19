export class RegexError extends Error {
	regex: RegExp;
	input: string;

	constructor(parameters: string, regex: RegExp, input: string) {
		super(parameters);
		this.regex = regex;
		this.input = input;
		this.name = "RegexError";
		this.stack = "The regex is not satisfied";
	}
}
