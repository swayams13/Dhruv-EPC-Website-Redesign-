import './preview.css'
import type { Preview } from '@storybook/react'

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true }, // surface comes from the company scope wrapper
  },
}

export default preview
