// Tailwind config for Storybook builds of datum-ui (apps/web has its own).
import type { Config } from 'tailwindcss'
import { datumPreset } from '@vedanta/tokens/tailwind'

const config: Config = {
  presets: [datumPreset as unknown as Config],
  content: ['./src/**/*.{ts,tsx}', './.storybook/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
}

export default config
