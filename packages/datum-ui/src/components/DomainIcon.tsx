// DomainIcon — Datum §12 domain set. Simplified section views, drawn from the drawing. 24×24 grid, 1.5px stroke, squared caps/joins. Sizes add 32 (feature) per §12. Decorative (aria-hidden); accessible names live on the parent.

export type DomainIconName =
  | 'exchanger'
  | 'vessel'
  | 'reactor'
  | 'column'
  | 'skid'
  | 'pipeSpool'
  | 'tank'
  | 'crane'
  | 'weldTorch'
  | 'ndtProbe'
  | 'stamp'
  | 'drawing'
  | 'bellows'
  | 'telescopic'
  | 'valve'
  | 'damper'
  | 'flange'
  | 'machining'

export interface DomainIconProps {
  name: DomainIconName
  size?: 16 | 20 | 24 | 32
}

function svgProps({ size = 24 }: Pick<DomainIconProps, 'size'>) {
  return {
    'aria-hidden': true,
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'square',
    strokeLinejoin: 'miter',
  } as const
}

const DOMAIN_PATHS: Record<DomainIconName, React.ReactNode> = {
  // Shell & tube exchanger: shell in section, tube bundle, inlet/outlet nozzles
  exchanger: (
    <>
      <path d="M5 7.5h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2z" />
      <path d="M4 10h16M4 12h16M4 14h16" />
      <path d="M6.5 4.5v3M17.5 16.5v3" />
    </>
  ),
  // Vertical vessel: shell with 2:1 elliptical heads, side nozzle with flange, legs
  vessel: (
    <>
      <path d="M7.5 17.5v-11a4.5 2.5 0 0 1 9 0v11a4.5 2.5 0 0 1-9 0" />
      <path d="M16.5 10.5H20M20 9.5v2" />
      <path d="M9 19.5v2M15 19.5v2" />
    </>
  ),
  // Reactor: vessel with internal trays and top inlet stub
  reactor: (
    <>
      <path d="M7.5 17.5v-11a4.5 2.5 0 0 1 9 0v11a4.5 2.5 0 0 1-9 0" />
      <path d="M9.5 9.5h5M9.5 12h5M9.5 14.5h5" />
      <path d="M12 4V2" />
    </>
  ),
  // Distillation column: tall slim shell, alternating trays
  column: (
    <>
      <path d="M9.5 19.5v-15a2.5 1.75 0 0 1 5 0v15a2.5 1.75 0 0 1-5 0" />
      <path d="M10 7.5h3M11 10h3M10 12.5h3M11 15h3M10 17.5h3" />
    </>
  ),
  // Skid: I-beam base frame carrying a small vessel and an equipment block
  skid: (
    <>
      <path d="M2.5 18.5h19v2h-19z" />
      <path d="M5.5 18.5V11a2.5 1.5 0 0 1 5 0v7.5" />
      <path d="M13.5 18.5v-6h6v6" />
    </>
  ),
  // Pipe spool: run with 90° elbow, two flange pairs at the joints
  pipeSpool: (
    <>
      <path d="M3 7.5h10a3 3 0 0 1 3 3V21" />
      <path d="M6.5 5.5v4M8 5.5v4" />
      <path d="M14 15.5h4M14 17h4" />
    </>
  ),
  // Storage tank: flat bottom, shallow domed roof, liquid level dash
  tank: (
    <>
      <path d="M4.5 20.5v-13a15 15 0 0 1 15 0v13z" />
      <path d="M7 15.5h4.5" />
    </>
  ),
  // Gantry crane: portal frame, trolley, hoist line and hook
  crane: (
    <>
      <path d="M4.5 19.5v-14h15v14" />
      <path d="M10.5 5.5h3v2h-3z" />
      <path d="M12 7.5v5a2.5 2.5 0 1 0 2.5 2.5" />
    </>
  ),
  // Welding torch at 45°: barrel, tapered nozzle, spark ticks at the tip
  weldTorch: (
    <>
      <path d="M15.5 4.5l4 4-9 9-4-4z" />
      <path d="M6.5 13.5L5 19l5.5-1.5" />
      <path d="M2 19h1.5M3 21l1-1M5 20.5V22" />
    </>
  ),
  // UT probe on plate: transducer with cable stub, echo arcs below the plate
  ndtProbe: (
    <>
      <path d="M3 12.5h18" />
      <path d="M9.5 12.5v-5h5v5M12 7.5V5.5" />
      <path d="M9 15.5a3 1.5 0 0 0 6 0M7 18.5a5 2 0 0 0 10 0" />
    </>
  ),
  // Inspection stamp: double ring seal with asterisk mark
  stamp: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18z" />
      <path d="M12 6.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 1 0 0-11z" />
      <path d="M12 9.75v4.5M10.1 10.9l3.8 2.2M13.9 10.9l-3.8 2.2" />
    </>
  ),
  // GA drawing: sheet with title block and a dimension line
  drawing: (
    <>
      <path d="M5.5 4.5h13a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2z" />
      <path d="M14.5 19.5v-3h6" />
      <path d="M6.5 7.5v4M17.5 7.5v4M6.5 9.5h11" />
      <path d="M6.5 9.5l2-.8v1.6zM17.5 9.5l-2-.8v1.6z" fill="currentColor" stroke="none" />
    </>
  ),
  // Expansion bellows in section: pipe walls both sides, five convolutions
  bellows: (
    <>
      <path d="M2 8.5h5l1-3 1 3 1-3 1 3 1-3 1 3 1-3 1 3 1-3 1 3h5" />
      <path d="M2 15.5h5l1 3 1-3 1 3 1-3 1 3 1-3 1 3 1-3 1 3 1-3h5" />
    </>
  ),
  // Telescopic slip joint: inner pipe sliding in outer, travel arrow
  telescopic: (
    <>
      <path d="M12.5 7.5h-10v9h10" />
      <path d="M8.5 9.5h13v5h-13" />
      <path d="M14.5 19.5h5M17.5 17.5l2 2-2 2" />
    </>
  ),
  // Check valve: bowtie symbol with hinged flap off the seat
  valve: (
    <>
      <path d="M3.5 8l8.5 4-8.5 4zM20.5 8l-8.5 4 8.5 4z" />
      <path d="M12 12l3.5-5.5" />
    </>
  ),
  // Louver damper: duct section with three blades at 45°
  damper: (
    <>
      <path d="M5.5 5.5h13a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z" />
      <path d="M5.5 15.5l5-5M9.5 15.5l5-5M13.5 15.5l5-5" />
    </>
  ),
  // Bolted flange pair in section: two flanges, bolts above/below bore, pipe walls
  flange: (
    <>
      <path d="M8.5 5.5H11v13H8.5zM13 5.5h2.5v13H13z" />
      <path d="M7.5 8.5h9M7.5 15.5h9" />
      <path d="M2 10.5h6.5M2 13.5h6.5M15.5 10.5H22M15.5 13.5H22" />
    </>
  ),
  // Lathe turning: workpiece bar, tool wedge on the surface, chip tick
  machining: (
    <>
      <path d="M2.5 12.5H16v5H2.5z" />
      <path d="M15 12.5l2.5-6.5 4 4z" />
      <path d="M13.5 10l-1.7-1.7" />
    </>
  ),
}

export function DomainIcon({ name, size = 24 }: DomainIconProps): React.ReactElement {
  return <svg {...svgProps({ size })}>{DOMAIN_PATHS[name]}</svg>
}
