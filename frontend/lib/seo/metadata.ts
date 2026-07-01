export const SITE_NAME = 'MailCraft'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const DEFAULT_TITLE = `${SITE_NAME} — AI Email Generator`

export const DEFAULT_DESCRIPTION = 'Generate clear, professional emails in seconds. Pick a tone and length, describe your topic, and let AI draft the perfect message.'

export const KEYWORDS = [
  'email generator',
  'ai email writer',
  'professional email',
  'email assistant',
  'email drafting',
  'business email',
  'ai writing assistant',
  'email automation',
]

export const AUTHOR = 'MailCraft'

export const CREATOR = 'MailCraft'

export const PUBLISHER = 'MailCraft'

export const OG_IMAGE = '/small.png'

export const OG_IMAGE_WIDTH = 512

export const OG_IMAGE_HEIGHT = 512

export const OG_IMAGE_ALT = `${SITE_NAME} Logo`

export const PAGE_TITLES = {
  home: DEFAULT_TITLE,
  login: `Sign in to ${SITE_NAME}`,
  register: `Create your free ${SITE_NAME} account`,
  dashboard: `Dashboard — ${SITE_NAME}`,
  pricing: `Pricing — ${SITE_NAME}`,
  profile: `Profile — ${SITE_NAME}`,
} as const

export const PAGE_DESCRIPTIONS = {
  home: DEFAULT_DESCRIPTION,
  login: 'Sign in to your MailCraft account to continue generating professional emails.',
  register: 'Create your free MailCraft account and start writing better emails in seconds.',
  dashboard: 'Generate professional emails with AI.',
  pricing: 'Simple, transparent pricing for every kind of email writer. Start free, upgrade when you need more.',
  profile: 'Manage your MailCraft account settings and preferences.',
} as const
