export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-end gap-1.5" role="status" aria-label="Loading">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-1.5 animate-pulse rounded-full bg-navy/30"
            style={{
              height: `${12 + i * 6}px`,
              animationDelay: `${i * 120}ms`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
