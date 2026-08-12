export function EmptyState({ title, hint, icon, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center text-brand-300 mb-4">
        {icon || (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
          </svg>
        )}
      </div>
      <div className="text-lg font-bold text-brand-700">{title}</div>
      {hint && <div className="mt-1 text-sm text-brand-400 max-w-xs">{hint}</div>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
