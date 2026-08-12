import { useUI } from '../store/uiStore'
import { IconCheck } from './Icons'

export function Toast() {
  const msg = useUI(s => s.toast)
  if (!msg) return null
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-pop">
      <div className="bg-brand-700 text-white px-4 py-2.5 rounded-full shadow-lg text-sm font-semibold flex items-center gap-2">
        <IconCheck /> {msg}
      </div>
    </div>
  )
}
