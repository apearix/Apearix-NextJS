import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Apearix | Software Engineering & AI Solutions',
    short_name: 'Apearix',
    description: 'Apearix is a premier software engineering company building custom web applications, SaaS platforms, mobile apps, custom AI agents, AI automation, and enterprise cloud solutions.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#6D28F5',
    categories: ['business', 'productivity', 'utilities'],
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}

