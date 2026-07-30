import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.apearix.com';
  const lastModified = new Date();

  const routes = [
    '',
    '/company/about',
    '/company/careers',
    '/company/contact',
    '/services/web-development',
    '/services/saas-development',
    '/services/ai-automation',
    '/services/ui-ux-design',
    '/services/mobile-app-development',
    '/services/cloud-devops',
    '/work/portfolio',
    '/work/case-studies',
    '/resources/blog',
    '/resources/faq',
    '/legal/privacy-policy',
    '/legal/terms-and-conditions',
    '/legal/cookie-policy',
  ];

  return routes.map((route) => {
    let priority = 0.7;
    let changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly';

    if (route === '') {
      priority = 1.0;
      changeFrequency = 'daily';
    } else if (route.startsWith('/services') || route.startsWith('/company/contact')) {
      priority = 0.9;
      changeFrequency = 'weekly';
    } else if (route.startsWith('/work')) {
      priority = 0.8;
      changeFrequency = 'weekly';
    } else if (route.startsWith('/legal')) {
      priority = 0.3;
      changeFrequency = 'monthly';
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified,
      changeFrequency,
      priority,
    };
  });
}
