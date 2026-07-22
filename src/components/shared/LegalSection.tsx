import type { ReactNode } from 'react'

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-navy">{title}</h2>
      <div className="prose-legal mt-3 space-y-3 text-base leading-relaxed text-muted-foreground [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
        {children}
      </div>
    </div>
  )
}
