import type { Config } from 'tailwindcss'
import { datumPreset } from '@vedanta/tokens/tailwind'

const config: Config = {
  presets: [datumPreset as unknown as Config],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/datum-ui/src/**/*.{ts,tsx}',
  ],
  // All values come from datumPreset — no extensions, no arbitrary values
  // tailwindcss/no-arbitrary-value ESLint rule enforces this
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
