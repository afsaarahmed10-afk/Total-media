// Single source of truth for the WhatsApp contact number — used by the
// floating chat button, the Contact page, and the Footer.
export const WHATSAPP_DISPLAY_NUMBER = '+81 80-5500-2929'
const WHATSAPP_DIGITS = '818055002929'

export function getWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_DIGITS}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
