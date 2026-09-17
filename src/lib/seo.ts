import { siteConfig } from '../config/site';

export function absoluteUrl(pathname: string, site?: URL | string | null): string {
  const base = site ? site.toString() : 'https://www.labelprinttools.com';
  return new URL(pathname, base).toString();
}

export function organizationSchema(site?: URL | string | null) {
  const url = absoluteUrl('/', site);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}#organization`,
    name: siteConfig.name,
    url
  };
}

export function websiteSchema(site?: URL | string | null) {
  const url = absoluteUrl('/', site);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}#website`,
    name: siteConfig.name,
    url,
    description: siteConfig.description,
    publisher: { '@id': `${url}#organization` }
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; path: string }>,
  site?: URL | string | null
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, site)
    }))
  };
}

export function webApplicationSchema(input: {
  name: string;
  description: string;
  path: string;
  site?: URL | string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path, input.site),
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };
}
