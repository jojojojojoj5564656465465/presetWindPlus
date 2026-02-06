# preset-wind-plus

**UnoCSS preset reducing Tailwind syntax by 30%**

**Generated:** 2026-02-06  
**Commit:** 8c0469f  
**Branch:** main  

## Overview

Plugin extending `@unocss/preset-wind4` with shorthand CSS utilities. Converts compact syntax to full Tailwind classes.

## Structure

```
.
├── src/               # Source code
│   ├── index.ts       # Main preset factory
│   ├── utils.ts       # Shared utilities
│   ├── types.d.ts     # Type definitions
│   ├── utilsFN/       # Utility functions
│   └── nestingRules/  # Tailwind compression rules
├── test/              # Vitest tests
├── playground/        # Vite demo app
└── dist/              # Build output (unbuild)
```

## Where to Look

| Task | Location | Notes |
|------|----------|-------|
| Add new rule | `src/index.ts` | Rules array, lines 41-276 |
| Utility functions | `src/utilsFN/` | Units, FluidSize, validation |
| Type definitions | `src/types.d.ts` | Category, Before types |
| Tailwind compression | `src/nestingRules/tailwindKiller.ts` | Nested variant parsing |
| Regex patterns | `src/utils.ts:195` | `myUnits` constant |

## Code Map

| Symbol | Type | Location | Role |
|--------|------|----------|------|
| `presetWindPlus` | Factory | `src/index.ts:35` | Main preset export |
| `StarterOptions` | Interface | `src/index.ts:13` | Config options |
| `tailwindClasses` | Const | `src/utils.ts:143` | CSS property mapping |
| `myUnits` | Regex | `src/utils.ts:195` | Unit parsing pattern |
| `FluidSize` | Function | `src/utilsFN/FluidSize.ts` | Responsive clamp() |
| `tailwindKiller` | Function | `src/nestingRules/tailwindKiller.ts` | Variant compression |

## Conventions

- **ESM only** (`"type": "module"`)
- **Valibot** for runtime validation
- **Biome** for lint/format (lineWidth: 220, indent: 3)
- **TypeScript strict** mode
- **Unbuild** for bundling (dual ESM/CJS output)
- Regex patterns stored as constants, compiled once

## Anti-Patterns

- **NEVER** use `as any` or `@ts-ignore` (strict TS enforced)
- **NEVER** modify arrays in place without cloning
- **AVOID** `console.error` in production (use ValiError handling)
- **DON'T** add side effects (package has `sideEffects: false`)
- Regex groups must be validated with Valibot before use

## Unique Styles

### Unit Syntax
All units use bracket notation for non-standard values:
- `p-[6%]-[4rem]` → padding with % and rem
- `size-[9%]-[7rem]` → width/height with units
- `flex|10|50|[500rem]` → flex-basis with unit

### Fluid Sizes
Prefix with `~` for clamp() responsive values:
- `~text-14/20` → font-size with fluid scaling
- `~m-8/16` → margin scales 8px to 16px

### Flexbox Grid
3x3 grid numbering for quick positioning:
- `flex-row-5` → center-center
- `flex-col-9` → end-end (bottom-right)

### Tailwind Compression
Comma-separated variants in brackets:
- `text-[red,hover:orange,md:hover:green]`

## Commands

```bash
pnpm dev          # Watch build
pnpm build        # Production build
pnpm test         # Vitest
pnpm lint         # Biome lint + format
pnpm play         # Vite playground
pnpm release      # Bump + publish
```

## Notes

- Requires `@unocss/preset-wind4` to work (peer dependency pattern)
- Uses `string-ts` for type-safe string manipulation
- All error codes prefixed: `ERROR UNOCSS code:#XX`
- Fallback value on error: `0in`
- Supports CSS logical properties (inline/block)
