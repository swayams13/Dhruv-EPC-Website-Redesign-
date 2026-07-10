import type { Meta, StoryObj } from '@storybook/react'
import { SpecTable } from './SpecTable'
import { withCompany } from '../story-helpers'

const meta: Meta<typeof SpecTable> = {
  title: 'Datum/SpecTable',
  component: SpecTable,
}
export default meta
type Story = StoryObj<typeof SpecTable>

const exchangerRows = [
  { param: 'Design code', value: 'ASME Sec VIII Div 1', note: 'U stamp' },
  { param: 'Max shell diameter', value: '3,600', unit: 'mm' },
  { param: 'Max tube length', value: '12,000', unit: 'mm' },
  { param: 'Max weight', value: '250', unit: 'T', note: 'single piece' },
  { param: 'MOC', value: 'CS / SS 316L / duplex', note: 'per datasheet' },
  { param: 'TEMA class', value: 'B / C / R' },
]

export const Dhruv: Story = {
  args: { rows: exchangerRows, caption: 'Shell & tube heat exchanger — capability' },
  decorators: [withCompany('dhruv')],
}

export const Precise: Story = {
  args: {
    caption: 'Metallic expansion bellows — capability',
    rows: [
      { param: 'Design code', value: 'EJMA / ASME B31.3' },
      { param: 'Diameter range', value: '50 – 4,000', unit: 'mm NB' },
      { param: 'Ply configuration', value: '1 – 5', unit: 'ply' },
      { param: 'MOC', value: 'SS 304 / 316 / Inconel' },
    ],
  },
  decorators: [withCompany('precise')],
}

export const EngineeringDensity: Story = {
  args: {
    rows: exchangerRows,
    density: 'engineering',
    caption: 'Engineering density — capability matrices',
  },
  decorators: [withCompany('dhruv')],
}

export const ComparativeMatrix: Story = {
  args: {
    caption: 'Capability matrix — pinned first column, horizontal scroll',
    columns: ['Vessels', 'Exchangers', 'Columns', 'Reactors'],
    matrixRows: [
      { param: 'Max diameter (mm)', values: ['4,000', '3,600', '3,200', '3,000'] },
      { param: 'Max weight (T)', values: ['250', '250', '180', '160'] },
      { param: 'Max length (mm)', values: ['24,000', '12,000', '30,000', '18,000'] },
      { param: 'Design codes', values: ['ASME VIII 1/2', 'ASME VIII + TEMA', 'ASME VIII', 'ASME VIII'] },
    ],
  },
  decorators: [withCompany('dhruv')],
}
