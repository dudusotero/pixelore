export function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 8 8"
      role="img"
      aria-label="pixelore logo"
      style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
    >
      <rect width="8" height="8" fill="var(--po-color-bg-elevated)" />
      <rect x="1" y="1" width="2" height="1" fill="var(--po-color-primary)" />
      <rect x="3" y="1" width="2" height="1" fill="var(--po-color-primary)" />
      <rect x="1" y="2" width="1" height="1" fill="var(--po-color-primary)" />
      <rect x="5" y="2" width="1" height="1" fill="var(--po-color-primary)" />
      <rect x="1" y="3" width="1" height="1" fill="var(--po-color-primary)" />
      <rect x="5" y="3" width="1" height="1" fill="var(--po-color-primary)" />
      <rect x="1" y="4" width="2" height="1" fill="var(--po-color-primary)" />
      <rect x="3" y="4" width="2" height="1" fill="var(--po-color-primary)" />
      <rect x="1" y="5" width="1" height="1" fill="var(--po-color-primary)" />
      <rect x="1" y="6" width="1" height="1" fill="var(--po-color-primary)" />
    </svg>
  )
}
