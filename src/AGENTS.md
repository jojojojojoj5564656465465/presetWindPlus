# src/

**Core preset source code**

## Overview

Main preset implementation with 14 rule categories for CSS shorthand compression.

## Structure

```
src/
├── index.ts              # Preset factory with all rules
├── utils.ts              # Shared regex utilities
├── types.d.ts            # TypeScript definitions
├── utilsFN/              # Utility functions
└── nestingRules/         # Tailwind variant compression
```

## Where to Look

| Task | Location | Notes |
|------|----------|-------|
| Add new rule | `index.ts:41-276` | Rules array with regex patterns |
| Fix unit parsing | `utils.ts:195` | `myUnits` regex constant |
| Update CSS mapping | `utils.ts:143` | `tailwindClasses` dictionary |
| Type changes | `types.d.ts` | Category, Before union types |

## Conventions

- Rules defined as tuples: `[regex, handler, autocomplete]`
- Regex groups validated with Valibot parsers
- Error handling returns `0in` fallback
- CSS logical properties preferred (inline/block vs left/right)

## Anti-Patterns

- **DON'T** add rules without autocomplete metadata
- **DON'T** use string concatenation for CSS values
- **AVOID** nested ternaries in rule handlers

## Rule Categories

1. **flex\|*\|*\|*** - Flex grow/shrink/basis
2. **flex-(row\|col)-[1-9]** - 3x3 grid positioning
3. **p/m/inset-*-*-*-* - Multi-directional spacing
4. **px/py/mx/my/gap-**-** - 2-value spacing
5. **inset-(x\|y)-**-** - Logical inset
6. **gap-(x\|y)-*** - Gap direction
7. **size-*** - Width/height shorthand
8. **m*-trim** - Margin trim
9. **vertical-(rl\|lr)** - Writing mode
10. **grid-area-*** - Grid area names
11. **~*-min/max** - Fluid responsive sizes
12. **Shortcuts** - Tailwind variant compression
