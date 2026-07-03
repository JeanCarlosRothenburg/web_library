import { initials } from './utils'

const palettes = [
  ['#dcfce7', '#bbf7d0'],
  ['#dbeafe', '#bfdbfe'],
  ['#fef3c7', '#fde68a'],
  ['#ede9fe', '#ddd6fe'],
  ['#fee2e2', '#fecaca'],
]

export function createCoverDataUrl(title: string, seed = 0) {
  const [start, end] = palettes[Math.abs(seed) % palettes.length]
  const mark = initials(title).slice(0, 3) || 'BGV'
  const safeTitle = title.slice(0, 28)

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="420" height="560" viewBox="0 0 420 560">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${start}" />
          <stop offset="100%" stop-color="${end}" />
        </linearGradient>
      </defs>
      <rect width="420" height="560" rx="36" fill="url(#bg)" />
      <circle cx="338" cy="88" r="88" fill="rgba(255,255,255,0.22)" />
      <circle cx="98" cy="462" r="96" fill="rgba(255,255,255,0.16)" />
      <text x="44" y="132" fill="#0f172a" font-size="28" font-family="Inter, system-ui, sans-serif" opacity="0.8">Biblioteca</text>
      <text x="44" y="208" fill="#0f172a" font-size="72" font-weight="700" font-family="Inter, system-ui, sans-serif">${mark}</text>
      <text x="44" y="300" fill="#0f172a" font-size="30" font-weight="600" font-family="Inter, system-ui, sans-serif">${safeTitle}</text>
      <text x="44" y="350" fill="#0f172a" font-size="20" font-family="Inter, system-ui, sans-serif" opacity="0.72">Acervo municipal</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

