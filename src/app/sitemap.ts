import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { LESSONS } from '@/lessons'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/lessons`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...LESSONS.map((lesson) => ({
      url: `${SITE_URL}/lessons/${lesson.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}