import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Apearix | Software Engineering Company | AI-Powered Solutions & Automation',
    short_name: 'Apearix',
    description: 'Apearix is a software engineering company building custom web applications, SaaS platforms, mobile apps, browser extensions, AI-powered software, AI agents, chatbots, workflow automation, cloud solutions, and modern digital products for businesses.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#6D28F5',
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
