import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/dashboard/', '/store/checkout', '/login', '/register'],
    },
    sitemap: 'https://eundeur.com/sitemap.xml',
  };
}
