import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { Logo } from '@/components/brand/Logo'
import { AnimatedAuthBackground } from './AnimatedAuthBackground'

interface AuthLayoutProps {
  children: ReactNode
  /** Headline shown on the dark branding panel (desktop only). */
  panelTitle?: string
  panelDescription?: string
}

export function AuthLayout({ children, panelTitle, panelDescription }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex">
        <AnimatedAuthBackground />

        <div className="relative z-10">
          <Link to="/" aria-label="TOTAL MEDIA home">
            <Logo tone="white" />
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-3xl font-extrabold leading-tight tracking-tight"
          >
            {panelTitle ?? 'Event production, engineered without compromise.'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-4 text-white/70"
          >
            {panelDescription ??
              'Manage your quotations, rental requests, and event bookings from a single account.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 rounded-xl border border-white/15 bg-white/10 p-5 backdrop-blur-md"
          >
            <p className="text-sm leading-relaxed text-white/80">
              “One accountable technical partner, from proposal to strike — that’s the whole
              point of working with TOTAL MEDIA.”
            </p>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-white/50">
              TOTAL MEDIA Client Services
            </p>
          </motion.div>
        </div>

        <p className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} TOTAL MEDIA Inc. All rights reserved.
        </p>
      </div>

      <div className="flex flex-col bg-mist lg:bg-white">
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Link to="/" aria-label="TOTAL MEDIA home">
            <Logo />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-12 pt-4 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-md"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
