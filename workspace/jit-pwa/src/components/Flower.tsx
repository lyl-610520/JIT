import type { FlowerStage } from '../state/store'

export default function Flower({ stage }: { stage: FlowerStage }) {
  if (stage === 'seed') {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" className="text-fg/70"><circle cx="32" cy="44" r="6" fill="currentColor" /><rect x="20" y="46" width="24" height="8" rx="4" fill="currentColor" opacity="0.3"/></svg>
    )
  }
  if (stage === 'sprout') {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" className="text-fg/80">
        <rect x="30" y="28" width="4" height="20" rx="2" fill="currentColor" />
        <path d="M32 34 C24 30, 20 26, 18 20 C26 22, 28 26, 32 34 Z" fill="currentColor" opacity="0.6"/>
      </svg>
    )
  }
  if (stage === 'seedling') {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" className="text-fg">
        <rect x="31" y="24" width="2" height="26" rx="1" fill="currentColor" />
        <path d="M32 30 C26 28, 22 25, 20 20 C28 22, 30 26, 32 30 Z" fill="currentColor" opacity="0.6"/>
        <path d="M32 34 C38 32, 42 29, 44 24 C36 26, 34 30, 32 34 Z" fill="currentColor" opacity="0.6"/>
      </svg>
    )
  }
  if (stage === 'bud') {
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" className="text-fg">
        <rect x="31" y="20" width="2" height="30" rx="1" fill="currentColor" />
        <circle cx="32" cy="18" r="8" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="text-fg">
      <rect x="31" y="20" width="2" height="30" rx="1" fill="currentColor" />
      <g fill="currentColor" opacity="0.95">
        <circle cx="32" cy="16" r="6" />
        <circle cx="22" cy="20" r="5" />
        <circle cx="42" cy="20" r="5" />
        <circle cx="26" cy="10" r="4" />
        <circle cx="38" cy="10" r="4" />
      </g>
    </svg>
  )
}