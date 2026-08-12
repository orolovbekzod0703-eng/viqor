export function Logo({ size = 28 }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <path d="M6 6h6l8 22 8-22h6L24 34h-8L6 6z" fill="currentColor" />
      </svg>
      <span className="text-xl font-extrabold tracking-tight">Viqor</span>
    </div>
  )
}
