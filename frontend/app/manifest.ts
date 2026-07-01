import { MetadataRoute } from 'next'
import { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION, OG_IMAGE } from '@/lib/seo/metadata'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: OG_IMAGE,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: OG_IMAGE,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
