// Shape data shared by each scene's finished-state markup (src/components/
// scenes/*Scene.tsx) and its timeline (src/motion/scenes/*.ts), so the two
// can't drift apart. All coordinates are in a 400×400 viewBox.

type Pt = readonly [number, number]
const r1 = (n: number) => Math.round(n * 10) / 10

// ─── Accumulation (About): one big triangle tessellated from small ones ───
export interface Tri { points: string; row: number; up: boolean }

export const ACCUMULATION: Tri[] = (() => {
  const rows = 6
  const apexY = 64
  const baseY = 340
  const half = 160 // half the base width
  const h = (baseY - apexY) / rows
  const w = (half * 2) / rows
  const out: Tri[] = []
  for (let r = 0; r < rows; r++) {
    const y0 = apexY + r * h
    const y1 = y0 + h
    // Apex x of each upward triangle in this row.
    const ax = (k: number) => 200 - (r * w) / 2 + k * w
    for (let k = 0; k <= r; k++) {
      out.push({ row: r, up: true, points: `${r1(ax(k))},${r1(y0)} ${r1(ax(k) - w / 2)},${r1(y1)} ${r1(ax(k) + w / 2)},${r1(y1)}` })
    }
    for (let k = 0; k < r; k++) {
      out.push({ row: r, up: false, points: `${r1(ax(k))},${r1(y0)} ${r1(ax(k + 1))},${r1(y0)} ${r1((ax(k) + ax(k + 1)) / 2)},${r1(y1)}` })
    }
  }
  return out
})()

// ─── Thread (Work): one line through five nodes, one per mission app ───
export const THREAD_NODES: readonly Pt[] = [
  [80, 84],
  [312, 132],
  [104, 214],
  [298, 274],
  [196, 340],
]
export const THREAD_PATH = `M${THREAD_NODES.map(([x, y]) => `${x} ${y}`).join(' L')}`

// ─── Timeline (Process): five phases, each node a different shape ───
export const TIMELINE_NODES: readonly Pt[] = [
  [64, 300],
  [132, 112],
  [200, 288],
  [268, 112],
  [336, 288],
]
export const TIMELINE_PATH = `M${TIMELINE_NODES.map(([x, y]) => `${x} ${y}`).join(' L')}`

const R = 24
export const circlePath = ([x, y]: Pt, r = R) =>
  `M${x - r} ${y} A${r} ${r} 0 1 0 ${x + r} ${y} A${r} ${r} 0 1 0 ${x - r} ${y} Z`
const squarePath = ([x, y]: Pt) => `M${x - 21} ${y - 21} L${x + 21} ${y - 21} L${x + 21} ${y + 21} L${x - 21} ${y + 21} Z`
const hexPath = ([x, y]: Pt) =>
  `M${Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2
    return `${r1(x + R * Math.cos(a))} ${r1(y + R * Math.sin(a))}`
  }).join(' L')} Z`
const trianglePath = ([x, y]: Pt) => `M${x} ${y - 26} L${x + 25} ${y + 18} L${x - 25} ${y + 18} Z`

// Final shape per phase: Discovery, Design, Development, Launch, Handoff (key).
export const TIMELINE_SHAPES = [
  circlePath(TIMELINE_NODES[0]),
  squarePath(TIMELINE_NODES[1]),
  hexPath(TIMELINE_NODES[2]),
  trianglePath(TIMELINE_NODES[3]),
  circlePath(TIMELINE_NODES[4], 18), // the key's bow; its shaft is drawn separately
] as const

// ─── Network (Why not AI): seven nodes rerouted through one human node ───
export const NETWORK_CENTER: Pt = [200, 200]
export const NETWORK_NODES: readonly Pt[] = Array.from({ length: 7 }, (_, i) => {
  const a = ((Math.PI * 2) / 7) * i - Math.PI / 2
  return [r1(200 + 140 * Math.cos(a)), r1(200 + 140 * Math.sin(a))] as const
})
// Each edge starts as a direct node-to-node chord and ends as a spoke into
// the center. Same command structure, so the `d` string tweens point-wise.
export const networkChord = (i: number) => {
  const [x, y] = NETWORK_NODES[i]
  const [tx, ty] = NETWORK_NODES[(i + 2) % 7]
  return `M${x} ${y} L${tx} ${ty}`
}
export const networkSpoke = (i: number) => {
  const [x, y] = NETWORK_NODES[i]
  return `M${x} ${y} L${NETWORK_CENTER[0]} ${NETWORK_CENTER[1]}`
}

// ─── Door (Contact): a door that swings open onto light ───
export const DOOR = {
  closed: 'M132 64 L268 64 L268 346 L132 346 Z',
  open: 'M132 64 L176 88 L176 322 L132 346 Z',
  knobClosed: [250, 210] as Pt,
  knobOpen: [166, 210] as Pt,
} as const
