const PREFIX = '+998'

/**
 * Faqat raqam kiritish, +998 doim boshida turadi.
 * Saqlanadigan qiymat kanonik shakl: "+998XXXXXXXXX" yoki bo'sh string.
 * Ekranda "+998 XX XXX XX XX" ko'rinishida formatlanadi.
 */
function extractDigits(v) {
  const nums = String(v || '').replace(/\D/g, '')
  const rest = nums.startsWith('998') ? nums.slice(3) : nums
  return rest.slice(0, 9)
}

function format(digits) {
  let s = PREFIX
  if (digits.length === 0) return s + ' '
  s += ' ' + digits.slice(0, 2)
  if (digits.length > 2) s += ' ' + digits.slice(2, 5)
  if (digits.length > 5) s += ' ' + digits.slice(5, 7)
  if (digits.length > 7) s += ' ' + digits.slice(7, 9)
  return s
}

export function PhoneInput({ value, onChange, className = 'input', ...p }) {
  const digits = extractDigits(value)
  const display = format(digits)

  const handleChange = (e) => {
    const d = extractDigits(e.target.value)
    onChange(d ? PREFIX + d : '')
  }

  const handleKeyDown = (e) => {
    // Kursorni oxirda ushlab turish uchun boshqa navigatsiya ruxsat
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End']
    if (allowed.includes(e.key)) return
    if (e.ctrlKey || e.metaKey) return
    if (!/^\d$/.test(e.key)) e.preventDefault()
  }

  const putCursorAtEnd = (e) => {
    requestAnimationFrame(() => {
      const len = e.target.value.length
      try { e.target.setSelectionRange(len, len) } catch {}
    })
  }

  return (
    <input
      {...p}
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      value={display}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={putCursorAtEnd}
      onClick={putCursorAtEnd}
      className={className}
    />
  )
}
