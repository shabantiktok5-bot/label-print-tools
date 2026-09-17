export const siteConfig = {
  name: 'Label Print Tools',
  shortName: 'Label Print Tools',
  tagline: 'Free label printing calculators and production tools.',
  description:
    'Free label printing calculators for roll capacity, remaining labels, roll diameter, web width, thermal ribbons, ZPL sizes and sheet layouts.',
  email: 'hello@labelprinttools.com',
  socialImage: '/social-card.png',
  nav: [
    { label: 'Label Rolls', href: '/label-roll/' },
    { label: 'Production', href: '/production/' },
    { label: 'Thermal Printing', href: '/thermal-printing/' },
    { label: 'Sheet Labels', href: '/sheet-labels/' },
    { label: 'Guides', href: '/guides/' }
  ]
} as const;
