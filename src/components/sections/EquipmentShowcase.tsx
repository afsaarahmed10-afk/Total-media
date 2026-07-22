import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Reveal } from '@/components/shared/Reveal'
import { AbstractVisual } from '@/components/shared/AbstractVisual'
import { getEquipmentCategories } from '@/lib/data'

export function EquipmentShowcase() {
  const equipmentCategories = getEquipmentCategories()

  return (
    <section className="bg-mist py-20 lg:py-28">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Equipment Rental"
            title="A Nationwide Technical Inventory"
            description="Broadcast and touring-grade equipment, maintained on a fixed inspection schedule — available on its own or with our production team."
          />
          <Link
            to="/equipment"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-signal hover:underline sm:flex"
          >
            Browse full catalogue <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {equipmentCategories.map((category, i) => (
            <Reveal key={category.slug} delay={(i % 5) * 0.05}>
              <Link
                to={`/equipment/${category.slug}`}
                className="group block overflow-hidden rounded-xl border border-border bg-white"
              >
                <div className="relative aspect-square overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                    <AbstractVisual seed={category.slug} />
                  </div>
                </div>
                <p className="px-3 py-3 text-sm font-semibold text-navy group-hover:text-signal">
                  {category.name}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Link to="/equipment" className="flex items-center gap-1.5 text-sm font-semibold text-signal">
            Browse full catalogue <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
