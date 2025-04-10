## Features


We like the tailwindcss syntax, but it's often too long to read. Today, with unocss and this preset, you can reduce tailwind syntax by 30% and improve code readability.
You need [Preset-wind4 ](https://www.npmjs.com/package/@unocss/preset-wind3) and this preset to work
![Reduce 30% tailwind syntax](https://github.com/jojojojojoj5564656465465/unocss-preset-starter/assets/45184918/efb0180e-38f5-4360-89f5-92b646995de1)

### Liste des Shortcuts
- Flexbox
- Pading / margin
- margin-inline / pading-inline
- margin-trim
- Size
- inset-x or inset-y
- flex-grow flex-shrink flex-basis
- Compress tailwind Line 30%
- grid area
- fluide size

## Usage
```shell
bun i -D preset-wind-plus unocss @unocss/preset-wind4
```

```ts
// uno.config.ts
import { defineConfig} from "unocss";
import {presetWindPlus} from 'preset-wind-plus'
import presetWind4 from "@unocss/preset-wind4";
export default defineConfig({
  presets: [
    // ...
    presetWind4(),
    presetWindPlus({
      maxScreenW:1150,
      minScreenW:320,
    }),
  ],
})
```
```ts
// astro.config.ts
import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'

export default defineConfig({
  integrations: [
    UnoCSS(),
  ],
})
```
| Unocss My preset              | tailwind like or CSS                           |
|-------------------------------|------------------------------------------------|
| flex\|10\|50\|500             | grow-10 shrik-50 basis-500                     |
| flex\|10\|50\|[500rem]        | grow-10 shrik-50 basis-500rem                  |
| flex\|10\|50                  | grow-10 shrik-50                               |
| px-[6%]-[10rem]               | pl-[6%] pr-[10rem]                             |
| px-6-10                       | pl-6 pr-10                                     |
| mx-6-10                       | ml-6 mr-10                                     |
| mx-6-6                        | mx-6                                           |
| gap-6-11                      | gap-y-6 gap-x-11                               |
| gap-[6vw]-[11%]               | gap-y-[6vw] gap-x-[11%]                        |
| inset-x-6-9                   | inset-inline: 6px 9px                          |
| inset-x-[6%]-[9vw]            | inset-inline: 6% 9vw                           |
| inset-y-6-9                   | inset-block: 1.5rem 2.25rem                    |
| m-5-6-9-10                    |                                                |
| inset-6-9-10                  |  inset : 6 9 10;                               |
| p-6-4-8-201                   | pt-6 pr-4 pb-8 pl-201 or py-6-8 px-4-201       |
| p-[6%]-[4rem]-[8vw]-[201%]    | pt-6% pr-4rem pb-8vw pl-201%                   |
| p-6-4                         | py-6 px-4                                      |
| p-6-4-8                       |                                                |
| p-6-4-auto-auto               |                                                |
| flex-col-4                    | justify-items-start items-center flex flex-col |
| size-60                       | w-60 h-60                                      |
| size-min-fit                  | w-min h-fit                                    |
| size-60-80                    | w-60 h-80                                      |
| mx-trim \| my-trim \| mt-trim | margin-trim                                    |
| grid-area-one                 | grid-area: one;                                |
| grid-area-helloWorld          | grid-area: helloWorld;                         |
| my-trim                       | margin-trim: block                             |
| mt-trim                       | margin-trim: block-start;                      |

```
#### All css sizes supported if they are iside [brackets]
em|rem|%|vw|vh|svh|lvh|svw|lvw|dvw|svi|lvi|dvb => [21svh] [5/7] [1px]

text-[red,hover:orange]
bg-[red,lg:[hover:green-100,green-600],md:pink]
grid-[col-start-1,col-span-2,lg:[col-start-1,col-span-3,row-span-12]]

```
## Compress the length of tailwindcss Class
### Merge rules for :
list|col|row|grid|fill|font|text|bg|border|stroke|outline|underline|ring|divide
It reqiuere the ```presetWind()``` [Preset-wind](https://www.npmjs.com/package/@unocss/preset-wind)to work because it convert to tailwindcss class
[Preset-wind presset](https://www.npmjs.com/package/@unocss/preset-wind)

| unocss                                                      | Tailwind convertion                                                                         |
|-------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| text-[red,hover:orange,md:hover:[ green,blue,first:green ]] | text-red hover:text-orange md:hover:text-green md:hover:text-blue md:hover:first:text-green |

## Flexbox shortcut
![flexbox](https://github.com/jojojojojoj5564656465465/unocss-preset-starter/assets/45184918/f498deac-e3b2-40b0-96f6-a73c37f85553)
![Flexbox](doc/flexbox-unocss.gif)
Decompose the layout of the divs in a grid from 1 to 9.

```md
flex-row-1 flex-row-2 flex-row-3 flex-row-4 flex-row-5 flex-row-6 flex-row-7 flex-row-8 flex-row-9
flex-col-1 flex-col-2 flex-col-3 flex-col-4 flex-col-5 flex-col-6 flex-col-7 flex-col-8 flex-col-9
```
### unocss to tailwindcss exemple:
```md
flex-col-4 = justify-items-start items-center flex flex-col
```
```html
<div class="flex-row-2 border-3 size-100 [&>div]:(size-6)">
	<div class="bg-red-200! m-3"></div>
	<div class="bg-red-600 m-3"></div>
	<div class="bg-[#ffff] m-3"></div>
</div>
```

https://github.com/jojojojojoj5564656465465/unocss-preset-starter/assets/45184918/d43fa35e-5c34-400c-bc0c-110752c96d05

```css
.flex-row-2 {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: start;
}
.flex-col-4 {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
}
.flex-col-7 {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: end;
}
```
## copy and Past
### Don't forget to activate the UNOCSS extension with underline
[Unocss extension](https://marketplace.visualstudio.com/items?itemName=antfu.unocss)
```html
<div class="flex-row-8 border-[6,red,solid] [&>div]:(size-30 bg-green)  grid-[col-span-1,col-start-2]">
	<div class="bg-red-600  m-3"></div>
	<div class="bg-red-600  m-3"></div>
	<div class="bg-red-600  m-3"></div>
	<div class="bg-red-600! m-3"></div>
	<div class="bg-red-200! m-3"></div>
	<div class="bg-red-600 	m-3"></div>
	<div class="bg-[#ffff] size-10 m-3 md:row-[span-6,start-6] gap-3-9 flex|1|20|50%"></div>
</div>

<div class="grid grid-[rows-3,flow-col] grid-cols-[auto,1fr,10px] gap-4 px-[6rem]-[8em]">
  <div class="row-[start-2,span-2] grid-area-one gap-2-6 px-6-1 inset-x-4 p-[16rem]-16-auto-full">01</div>
  <div class="col-[end-3,span-2] bg-red grid-area-two">02</div>
  <div class="size-9-7">03</div>
  <div class="size-[9%]-[7rem] m-[7%]-[5rem]-screen-auto">09</div>
  <div class="mx-8rem-4 mx-auto mx-10-5 py-[88px]-88 px-px">03</div>
  <div class="inset-x-5-9 inset-y-[50%]-[9rem] bg-[red,lg:[hover:green-100,green-600],md:pink]">03</div>
</div>

```
## fluide size 

# Fluid Value Shortcuts for UnoCSS

All fluid value shortcuts must follow these rules:
1. They must start with `~` to indicate a fluid value.
2. The minimum and maximum values should be separated by `/`.

## Available Shortcuts

| Shortcut | Description |
|----------|-------------|
| `~m-min/max` | Fluid margin |
| `~mx-min/max` | Fluid horizontal margin (left and right) |
| `~my-min/max` | Fluid vertical margin (top and bottom) |
| `~mt-min/max` | Fluid top margin |
| `~mr-min/max` | Fluid right margin |
| `~mb-min/max` | Fluid bottom margin |
| `~ml-min/max` | Fluid left margin |
| `~p-min/max` | Fluid padding |
| `~px-min/max` | Fluid horizontal padding (left and right) |
| `~py-min/max` | Fluid vertical padding (top and bottom) |
| `~pt-min/max` | Fluid top padding |
| `~pr-min/max` | Fluid right padding |
| `~pb-min/max` | Fluid bottom padding |
| `~pl-min/max` | Fluid left padding |
| `~text-min/max` | Fluid font size |
| `~gap-min/max` | Fluid gap (for grid and flexbox layouts) |
| `~w-min/max` | Fluid width |
| `~h-min/max` | Fluid height |
| `~border-min/max` | Fluid border width |
| `~outline-min/max` | Fluid outline width |

## Examples

- `~m-8/16`: Creates a fluid margin that scales from 8px to 16px
- `~text-14/20`: Creates a fluid font size that scales from 14px to 20px
- `~w-100/200`: Creates a fluid width that scales from 100px to 200px

Note: The `min` and `max` values in these shortcuts represent pixels. The function will convert these to rem units and create a `clamp()` function that smoothly transitions between these values based on the viewport width.

This syntax allows for quick and easy creation of fluid, responsive designs without the need for multiple breakpoints or complex media queries.
## License

[MIT](./LICENSE) License © 2023
