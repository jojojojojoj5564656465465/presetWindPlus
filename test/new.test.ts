import { elementFromDictionary } from '../src/utils';
import { expect,describe,it } from 'vitest';

describe('elementFromDictionary', () => {
  it('returns the value for a valid key', () => {
    const obj: Record<string, string> = { foo: 'bar' };
    const key: keyof typeof obj = 'foo';
    const result =
elementFromDictionary(obj, key);
    expect(result).toBe('bar');
  });

  it('throws an error for an undefined key', () => {
    const obj: Record<string, string> = { foo: 'bar' };
    const key: keyof typeof obj = 'baz';
    expect(() => elementFromDictionary(obj, key)).toThrowError('key is undefined');
  });

  it('returns undefined for a missing key', () => {
    const obj: Record<string, string> = { foo: 'bar' };
    const key: keyof typeof obj = 'qux';
    expect(elementFromDictionary(obj, key)).toBeUndefined();
  });

});