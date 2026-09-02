// Keyboard-nav coverage for MegaPanel's focus trap (Session 9 verify step:
// "keyboard nav + axe on MegaPanel"). Axe coverage itself comes from the
// auto-globbed a11y.test.tsx via MegaPanel.stories.tsx — this file only
// asserts the interaction behavior stories can't: Tab wrapping and ESC.
import { useRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MegaPanel, type MegaPanelColumn } from './MegaPanel'

afterEach(cleanup)

const COLUMNS: MegaPanelColumn[] = [
  {
    companyLabel: 'Dhruv EPC Solutions',
    categories: [
      {
        name: 'Static Equipment',
        href: '/dhruv-epc/products/static-equipment',
        products: [{ name: 'Pressure Vessels', href: '/dhruv-epc/products/static-equipment/pressure-vessels' }],
      },
    ],
    allProductsHref: '/dhruv-epc/products',
    allProductsLabel: 'All Dhruv EPC products →',
  },
]

function Harness({ onClose }: { onClose: () => void }) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  return (
    <>
      <button ref={triggerRef} type="button">
        Products
      </button>
      <MegaPanel id="test-mega-panel" open onClose={onClose} triggerRef={triggerRef} columns={COLUMNS} />
    </>
  )
}

describe('MegaPanel keyboard behavior', () => {
  it('moves focus to the first link on open', () => {
    render(<Harness onClose={() => undefined} />)
    const firstLink = screen.getByRole('link', { name: 'Static Equipment' })
    expect(document.activeElement).toBe(firstLink)
  })

  it('wraps Tab from the last link back to the first', () => {
    render(<Harness onClose={() => undefined} />)
    const firstLink = screen.getByRole('link', { name: 'Static Equipment' })
    const lastLink = screen.getByRole('link', { name: 'All Dhruv EPC products →' })
    lastLink.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(firstLink)
  })

  it('wraps Shift+Tab from the first link back to the last', () => {
    render(<Harness onClose={() => undefined} />)
    const firstLink = screen.getByRole('link', { name: 'Static Equipment' })
    const lastLink = screen.getByRole('link', { name: 'All Dhruv EPC products →' })
    firstLink.focus()
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(lastLink)
  })

  it('closes on Escape and returns focus to the trigger', () => {
    const onClose = vi.fn()
    render(<Harness onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
    const trigger = screen.getByRole('button', { name: 'Products' })
    expect(document.activeElement).toBe(trigger)
  })
})
