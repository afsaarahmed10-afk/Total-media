export type PasswordStrengthLabel = 'weak' | 'fair' | 'good' | 'strong'

export interface PasswordStrength {
  /** 0–5 */
  score: number
  label: PasswordStrengthLabel
}

export function scorePassword(password: string): PasswordStrength {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  const label: PasswordStrengthLabel =
    score <= 1 ? 'weak' : score === 2 ? 'fair' : score <= 3 ? 'good' : 'strong'

  return { score, label }
}

export const MIN_PASSWORD_LENGTH = 8
