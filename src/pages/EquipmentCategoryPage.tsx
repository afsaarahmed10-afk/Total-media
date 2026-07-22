import { Link, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Seo } from '@/components/layout/Seo'
import { PageHero } from '@/components/shared/PageHero'
import { Reveal } from '@/components/shared/Reveal'
import { CtaBand } from '@/components/shared/CtaBand'
import { AbstractVisual } from '@/components/shared/AbstractVisual'
import { Badge } from '@/components/ui/badge'
import { getEquipmentByCategory, getEquipmentCategoryBySlug } from '@/lib/data'
import type { EquipmentAvailability } from '@/content/types'
import NotFoundPage from '@/pages/NotFoundPage'

const AVAILABILITY_LABEL: Record<EquipmentAvailability, string> = {
  'in-stock': 'In Stock',
  limited: 'Limited Availability',
  'made-to-order': 'Made to Order',
}

export default function EquipmentCategoryPage() {
  const { category = '' } = useParams()
  const categoryData = getEquipmentCategoryBySlug(category)
  const items = getEquipmentByCategory(category)

  if (!categoryData) return <NotFoundPage />

  return (
    <>
      <Seo
        title={`${categoryData.name} Rental`}
        description={`${categoryData.description} Browse specifications and request a quote from TOTAL MEDIA.`}
        path={`/equipment/${categoryData.slug}`}
      />
      <PageHero
        eyebrow="Equipment Category"
        title={categoryData.name}
        description={categoryData.description}
        visualSeed={categoryData.slug}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Equipment', to: '/equipment' },
          { label: categoryData.name },
        ]}
      />

      <section className="py-20 lg:py-24">
        <div className="container-page">
          {items.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <Reveal key={item.slug} delay={(i % 6) * 0.05}>
                  <Link
                    to={`/equipment/${item.categorySlug}/${item.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white transition-all hover:-translate-y-1 hover:border-signal/30 hover:shadow-lg hover:shadow-navy/5"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                        <AbstractVisual seed={item.visualSeed} />
                      </div>
                      <Badge className="absolute left-3 top-3 bg-white/90 text-navy hover:bg-white/90">
                        {AVAILABILITY_LABEL[item.availability]}
                      </Badge>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-semibold text-navy">{item.name}</h3>
                      <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{item.summary}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-signal opacity-0 transition-opacity group-hover:opacity-100">
                        View specs <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Equipment in this category is being catalogued — contact us for current availability.
            </p>
          )}
        </div>
      </section>

      <CtaBand
        title={`Ready to Book ${categoryData.name}?`}
        description="Request a quote and we'll confirm availability, specification, and pricing."
      />
    </>
  )
}
