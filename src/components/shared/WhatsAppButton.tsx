import { MessageCircle } from 'lucide-react'
import { getWhatsAppUrl } from '@/lib/whatsapp'

/** Persistent floating chat launcher, shown on every public page — kept in
 * WhatsApp's own brand green rather than the site palette so it still
 * reads instantly as "WhatsApp" rather than a generic contact button. */
export function WhatsAppButton() {
  return (
    <a
      href={getWhatsAppUrl("Hi TOTAL MEDIA, I'd like to know more about your services.")}
      target="_blank"
      rel="noopener noreferrer"
      title="Chat on WhatsApp"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:scale-105 sm:bottom-8 sm:right-8"
    >
      <MessageCircle className="size-7" fill="currentColor" strokeWidth={1.5} />
    </a>
  )
}
