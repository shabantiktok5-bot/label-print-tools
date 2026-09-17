export const siteConfig = {
  name: 'LabelMetric',
  shortName: 'LabelMetric',
  tagline: 'Label printing calculators that work on the production floor.',
  description:
    'Free label printing calculators for roll capacity, remaining labels, roll diameter, web width, thermal ribbons, ZPL dimensions, sheet layouts and production planning.',
  email: 'hello@labelmetric.example',
  socialImage: '/social-card.png',
  nav: [
    { label: 'Label Rolls', href: '/label-roll/' },
    { label: 'Production', href: '/production/' },
    { label: 'Thermal Printing', href: '/thermal-printing/' },
    { label: 'Sheet Labels', href: '/sheet-labels/' },
    { label: 'Guides', href: '/guides/' }
  ]
} as const;
