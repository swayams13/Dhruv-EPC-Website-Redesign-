'use client'
// Amber law (§13 "max one accent-filled element per view", resolved Session 7):
// chrome RFQ buttons (Header, MobileBottomBar) yield while an in-content amber
// RFQ ([data-rfq-anchor]: hero CTA row, RFQ band) is in the viewport.
import { useEffect, useState } from 'react'

export function useRfqAnchorInView(): boolean {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const anchors = document.querySelectorAll('[data-rfq-anchor]')
    if (anchors.length === 0) return
    const visible = new Set<Element>()
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target)
        else visible.delete(e.target)
      }
      setInView(visible.size > 0)
    })
    anchors.forEach((a) => observer.observe(a))
    return () => observer.disconnect()
  }, [])

  return inView
}
