import { getClients } from '@/lib/data'
import { Reveal } from '@/components/shared/Reveal'

export function TrustedByLogos() {
  const clients = getClients()

  return (
    <section className="border-y border-border bg-white py-14">
      <div className="container-page">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Trusted By Organizations Across Industries
          </p>
        </Reveal>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {clients.map((client) => (
            <span
              key={client.id}
              className="text-lg font-bold tracking-tight text-navy/35 grayscale transition-colors hover:text-navy/70"
            >
              {client.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
