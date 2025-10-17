/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://wanderlust-tours-india.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_BASE_URL || 'https://wanderlust-tours-india.vercel.app'}/sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    // Custom priority and changefreq for different pages
    const customConfig = {
      '/': {
        priority: 1.0,
        changefreq: 'weekly',
      },
      '/packages': {
        priority: 0.9,
        changefreq: 'weekly',
      },
      '/about': {
        priority: 0.8,
        changefreq: 'monthly',
      },
      '/contact': {
        priority: 0.8,
        changefreq: 'monthly',
      },
      '/reviews': {
        priority: 0.7,
        changefreq: 'weekly',
      },
    };

    const pageConfig = customConfig[path] || {
      priority: 0.7,
      changefreq: 'monthly',
    };

    return {
      loc: path,
      lastmod: new Date().toISOString(),
      priority: pageConfig.priority,
      changefreq: pageConfig.changefreq,
    };
  },
};