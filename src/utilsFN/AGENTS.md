# utilsFN/

**Specialized utility functions**

## Overview

Pure functions for unit processing, fluid sizing, validation, and Tailwind variant compression.

## Files

| File | Purpose |
|------|---------|
| `index.ts` | Barrel exports |
| `Units.ts` | CSS unit transformation (px→rem, etc.) |
| `FluidSize.ts` | clamp() responsive value generator |
| `fromMatchRemoveDuplicate.ts` | Deduplicate spacing values |
| `utils.valibot.ts` | Valibot validation schemas |
| `DictionaryParser.ts` | CSS property name mapping |

## Conventions

- All functions are pure (no side effects)
- Default exports for single-responsibility modules
- Valibot schemas validate all inputs
- Transform functions return CSS-ready strings

## Anti-Patterns

- **NEVER** export mutable state
- **DON'T** use `console.log` in utilities (throw instead)
- **AVOID** generic function names (`process`, `handle`)

## Key Functions

### UnitProcess
Transforms CSS units: `5` → `1.25rem`, `[10px]` → `10px`

### FluidSize
Generates `clamp(min, preferred, max)` for responsive scaling

### tailwindKiller
Parses nested variant syntax: `bg-[red,hover:green]`

### fromMatchRemoveDuplicate
Reduces `1 1 1 1` → `1`, `1 2 1 2` → `1 2`
