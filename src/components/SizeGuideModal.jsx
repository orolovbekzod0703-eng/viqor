import { useI18n } from '../hooks/useI18n'
import { IconClose } from './Icons'

const ROWS = [
  { size: 'S',  chest: '88–94',   waist: '74–80',   hip: '90–96' },
  { size: 'M',  chest: '94–100',  waist: '80–86',   hip: '96–102' },
  { size: 'L',  chest: '100–106', waist: '86–92',   hip: '102–108' },
  { size: 'XL', chest: '106–112', waist: '92–98',   hip: '108–114' }
]

export function SizeGuideModal({ open, onClose }) {
  const { t } = useI18n()
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden animate-pop">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-100">
          <h3 className="font-bold">{t.sizeGuide}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-brand-50 flex items-center justify-center"><IconClose /></button>
        </div>
        <div className="p-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-brand-400 uppercase text-xs">
                <th className="pb-2 font-semibold">{t.size}</th>
                <th className="pb-2 font-semibold">Chest (cm)</th>
                <th className="pb-2 font-semibold">Waist (cm)</th>
                <th className="pb-2 font-semibold">Hip (cm)</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(r => (
                <tr key={r.size} className="border-t border-brand-100">
                  <td className="py-2.5 font-bold">{r.size}</td>
                  <td className="py-2.5">{r.chest}</td>
                  <td className="py-2.5">{r.waist}</td>
                  <td className="py-2.5">{r.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
