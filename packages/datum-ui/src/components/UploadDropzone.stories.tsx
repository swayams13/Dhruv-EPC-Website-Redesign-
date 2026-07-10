import type { Meta, StoryObj } from '@storybook/react'
import { UploadDropzone } from './UploadDropzone'
import { withCompany } from '../story-helpers'

const meta: Meta<typeof UploadDropzone> = {
  title: 'Datum/UploadDropzone',
  component: UploadDropzone,
}
export default meta
type Story = StoryObj<typeof UploadDropzone>

// Story-only presign: resolves to a URL that will fail the PUT, which
// exercises the honest error + per-file retry path (§14 upload-before-submit).
const mockPresign = async (file: File) => ({
  url: `/mock-presigned/${encodeURIComponent(file.name)}`,
  key: `rfq/mock/${file.name}`,
})

export const Dhruv: Story = {
  args: { presign: mockPresign, onChange: () => {} },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: { presign: mockPresign, onChange: () => {} },
  decorators: [withCompany('precise')],
}
