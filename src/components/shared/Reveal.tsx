import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

/** Fade + rise on scroll-into-view. Transform/opacity only; reduced-motion
 * users get the static end state (MotionConfig reducedMotion="user" is set
 * at the app root). */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
