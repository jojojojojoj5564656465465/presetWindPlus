import { createGenerator } from 'unocss'
import { expect, it } from 'vitest'
import presetWindPlus from '../src'

it('presetWindPlus', async () => {
  const uno = createGenerator({
    presets: [presetWindPlus()],
  })
  const presets = uno.config.presets
  expect(presets).toHaveLength(1)

  const { css } = await uno.generate('bg-[red]')

  expect(css).toMatchInlineSnapshot(`""`)
})
