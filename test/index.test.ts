import { createGenerator } from 'unocss'
import { expect, it } from 'vitest'
import { unocssPresetWindExtra } from '../src'

it('presetStarter', async () => {
  const uno = createGenerator({
    presets: [unocssPresetWindExtra()],
  })
  const presets = uno.config.presets
  expect(presets).toHaveLength(1)

  const { css } = await uno.generate('my-trim p-5-[2rem]')

  expect(css).toMatchInlineSnapshot(`
		"/* layer: default */
		.p-5-\\[2rem\\]{padding:1.25rem 2rem;}
		.my-trim{margin-trim:block;}"
	`)
})
