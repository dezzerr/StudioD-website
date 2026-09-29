import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const baseUrl = 'https://www.studioderrick.co.uk';
const outputDir = join(process.cwd(), 'dist');
const template = await readFile(join(outputDir, 'index.html'), 'utf8');
const discovery = JSON.parse(await readFile(join(process.cwd(), 'src/data/discovery.json'), 'utf8'));

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

const link = (path, label) => `<a href="${escapeHtml(path)}">${escapeHtml(label)}</a>`;
const paragraph = value => `<p>${escapeHtml(value)}</p>`;
const questions = items => items.length ? `<section><h2>Frequently asked questions</h2>${items.map(item => `<h3>${escapeHtml(item.question)}</h3>${paragraph(item.answer)}`).join('')}</section>` : '';
const sections = items => items.map(item => `<section><h2>${escapeHtml(item.heading)}</h2>${paragraph(item.body)}</section>`).join('');

const commonLinks = [
  { path: '/', label: 'Home' },
  { path: '/areas', label: 'Service areas' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/faq', label: 'FAQs' },
  { path: '/contact', label: 'Contact' },
];

const entries = [
  {
    path: '/', title: 'Photographer in Stoke-on-Trent',
    description: 'Studio Derrick offers portrait, family and event photography from Stoke-on-Trent across Staffordshire, the Midlands and Northern England, with travel available for events.',
    heading: 'Studio Derrick photography in Stoke-on-Trent',
    paragraphs: ['Portraits, family sessions and event photography based in Stoke-on-Trent. Serving Staffordshire, the Midlands and Northern England, with travel for events.'],
    sections: [
      { heading: 'Portrait photography', body: 'Indoor or outdoor portraits and headshots with gentle direction and 10 fully edited images included.' },
      { heading: 'Family sessions', body: 'Relaxed family photographs indoors or outdoors, with your choice of 10 edited images included.' },
      { heading: 'Event photography', body: 'Discreet coverage for celebrations and business events with every final usable image edited and included.' },
    ],
    links: [
      { path: '/photographer-stoke-on-trent', label: 'Stoke-on-Trent photography' },
      { path: '/family-photographer-stoke-on-trent', label: 'Family photography in Stoke-on-Trent' },
      { path: '/collections/event-photography', label: 'Event photography portfolio' },
    ],
    schema: { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'Studio Derrick', url: baseUrl, email: 'hello@studioderrick.co.uk', address: { '@type': 'PostalAddress', addressLocality: 'Stoke-on-Trent', addressRegion: 'Staffordshire', addressCountry: 'GB' }, areaServed: ['Staffordshire', 'West Midlands', 'East Midlands', 'North West England', 'Yorkshire'] },
  },
  {
    path: '/about', title: 'About',
    description: 'Meet Studio Derrick, a photography business based in Stoke-on-Trent and serving Staffordshire, the Midlands and Northern England, with travel available for events.',
    heading: 'About Studio Derrick',
    paragraphs: [
      'Studio Derrick is a photography business based in Stoke-on-Trent, creating natural, considered images for people, families and businesses. Eight years of experience, more than 100 sessions, more than 100 happy clients and 100% satisfaction.',
      'Local sessions cover Stoke-on-Trent, Stafford, Stone, Kidsgrove, Alsager, Crewe and Nantwich. Event travel is available across Manchester, Liverpool, Birmingham, Nottingham, Sheffield, Leeds, Northampton, Bristol, London and surrounding areas.',
    ],
    links: [{ path: '/areas', label: 'Explore service areas' }, { path: '/contact', label: 'Get in touch' }],
  },
  {
    path: '/pricing', title: 'Pricing',
    description: 'Studio Derrick photography pricing for portraits, events, weddings and engagements. Based in Stoke-on-Trent and serving Staffordshire, the Midlands, Northern England and beyond for events.',
    heading: 'Studio Derrick photography pricing',
    paragraphs: ['Portrait photography is £110 per hour, events and weddings are £180 per hour, and engagements are £125 per hour. Each option has a 60-minute minimum. Travel and longer coverage can be discussed before booking.', 'Portrait and family sessions include your choice of 10 fully edited images. Event coverage includes every final usable edited image.'],
    links: [{ path: '/booking', label: 'Request a booking' }, { path: '/faq', label: 'Read booking FAQs' }],
  },
  {
    path: '/booking', title: 'Booking',
    description: 'Request portrait, family, event, wedding or engagement photography with Studio Derrick, based in Stoke-on-Trent and available across the Midlands, Northern England and beyond for events.',
    heading: 'Request a Studio Derrick photography booking',
    paragraphs: ['Choose portrait, event, wedding or engagement photography and request a time. Every request is reviewed before it is confirmed.', 'Studio Derrick is based in Stoke-on-Trent. Local portrait and family sessions serve Staffordshire and nearby areas. Event travel is available across the Midlands, Northern England and further afield by arrangement.'],
    links: [{ path: '/contact', label: 'Send an enquiry' }, { path: '/pricing', label: 'See rates' }],
  },
  {
    path: '/contact', title: 'Contact',
    description: 'Contact Studio Derrick for portrait, family and event photography from Stoke-on-Trent across Staffordshire, the Midlands and Northern England. Available to travel for events.',
    heading: 'Contact Studio Derrick',
    paragraphs: ['Email hello@studioderrick.co.uk about your photography project. Include your date, location, the kind of session or event and anything important to you.', 'Based in Stoke-on-Trent, Staffordshire, and available to travel for events across the UK.'],
    links: [{ path: 'mailto:hello@studioderrick.co.uk', label: 'Email Studio Derrick' }, { path: '/booking', label: 'Request a booking' }],
  },
  {
    path: '/areas', title: 'Photography Service Areas',
    description: 'Studio Derrick is based in Stoke-on-Trent for local portrait and family sessions, and travels across the Midlands, Northern England and beyond for events.',
    heading: 'Studio Derrick photography service areas',
    paragraphs: ['Based in Stoke-on-Trent. Portraits, headshots and family sessions can be arranged across Staffordshire and nearby areas. For events, Studio Derrick covers the Midlands, Northern England and other UK locations by arrangement.'],
    sections: [
      { heading: 'Near Stoke-on-Trent', body: 'Stoke-on-Trent, Stafford, Stone, Kidsgrove, Alsager, Crewe, Nantwich and surrounding areas.' },
      { heading: 'Events further afield', body: 'Manchester, Liverpool, Birmingham, Nottingham, Sheffield, Leeds, Northampton, Bristol, London and other locations by arrangement.' },
    ],
    links: discovery.pages.map(({ path, title }) => ({ path, label: title })),
  },
  {
    path: '/faq', title: 'Photography FAQs',
    description: 'Answers about Studio Derrick photography pricing, locations, portrait and family sessions, event coverage, booking and edited images.',
    heading: 'Photography questions, answered',
    paragraphs: ['Answers to common questions about Studio Derrick photography services, pricing, travel and booking.'],
    questions: discovery.generalQuestions,
    links: [{ path: '/pricing', label: 'See pricing' }, { path: '/booking', label: 'Request a booking' }],
  },
  {
    path: '/collections/studio-portraits', title: 'Portraits',
    description: 'Portrait photography based in Stoke-on-Trent, serving Staffordshire and the Midlands. Includes 10 fully edited images, with additional photographs available to purchase.',
    heading: 'Portrait photography with Studio Derrick',
    paragraphs: ['Studio or outdoor portraits and professional headshots with eight years of experience and gentle direction throughout. Every portrait session includes your choice of 10 fully edited images.'],
    links: [{ path: '/photographer-stoke-on-trent', label: 'Portraits in Stoke-on-Trent' }, { path: '/pricing', label: 'See pricing' }],
  },
  {
    path: '/collections/family-sessions', title: 'Family Sessions',
    description: 'Relaxed family portrait sessions based in Stoke-on-Trent, serving Staffordshire and the Midlands. Includes 10 fully edited images, with additional photographs available to purchase.',
    heading: 'Family photography with Studio Derrick',
    paragraphs: ['Relaxed indoor or outdoor family sessions with gentle direction and room for genuine interaction. Every family session includes your choice of 10 fully edited images.'],
    links: [{ path: '/family-photographer-stoke-on-trent', label: 'Family photographer in Stoke-on-Trent' }, { path: '/pricing', label: 'See pricing' }],
  },
  {
    path: '/collections/event-photography', title: 'Event Photography',
    description: 'Story-led event photography from Stoke-on-Trent across the Midlands, Northern England and beyond, with every final usable image edited and included.',
    heading: 'Event photography with Studio Derrick',
    paragraphs: ['Coverage for private celebrations and business events, from Stoke-on-Trent across the Midlands, Northern England and beyond. Every final usable image is edited and included.'],
    links: [{ path: '/event-photographer-manchester', label: 'Manchester events' }, { path: '/event-photographer-birmingham', label: 'Birmingham events' }, { path: '/pricing', label: 'See pricing' }],
  },
  ...discovery.pages.map(page => ({
    path: page.path,
    title: page.title,
    description: page.description,
    heading: page.heading,
    paragraphs: [page.lead],
    sections: page.sections,
    questions: page.questions,
    links: [...page.related, { path: `/booking?service=${page.bookingService}`, label: 'Request a booking' }],
    schema: { '@context': 'https://schema.org', '@type': 'Service', name: page.title, serviceType: page.serviceType, areaServed: page.areaServed, description: page.description, url: `${baseUrl}${page.path}`, provider: { '@type': 'LocalBusiness', name: 'Studio Derrick', url: baseUrl } },
  })),
];

const render = entry => {
  const title = `${entry.title} | Studio Derrick`;
  const url = `${baseUrl}${entry.path}`;
  const navigation = commonLinks.map(({ path, label }) => link(path, label)).join(' · ');
  const related = (entry.links || []).map(({ path, label }) => link(path, label)).join(' · ');
  const body = `<main style="background:#050505;color:#f5f5f5;min-height:100vh;padding:40px 6%;font-family:Arial,sans-serif;line-height:1.65;max-width:1100px;margin:auto"><nav aria-label="Main navigation">${navigation}</nav><h1>${escapeHtml(entry.heading)}</h1>${entry.paragraphs.map(paragraph).join('')}${sections(entry.sections || [])}${questions(entry.questions || [])}<p>${related}</p><footer>${link('mailto:hello@studioderrick.co.uk', 'hello@studioderrick.co.uk')}</footer></main>`;
  const metadata = `<link rel="canonical" href="${escapeHtml(url)}" /><meta property="og:title" content="${escapeHtml(title)}" /><meta property="og:description" content="${escapeHtml(entry.description)}" /><meta property="og:url" content="${escapeHtml(url)}" /><meta property="og:image" content="${baseUrl}/images/portrait-1.jpg" /><meta name="twitter:card" content="summary_large_image" />${entry.schema ? `<script type="application/ld+json" data-seo-id="page-jsonld">${JSON.stringify(entry.schema).replace(/</g, '\\u003c')}</script>` : ''}`;
  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(entry.description)}" />`)
    .replace('</head>', `    ${metadata}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
};

await mkdir(join(outputDir, 'prerendered'), { recursive: true });
for (const entry of entries) {
  const slug = entry.path === '/' ? 'home' : entry.path.slice(1).replaceAll('/', '-');
  await writeFile(join(outputDir, 'prerendered', `${slug}.html`), render(entry));
}
console.log(`Generated ${entries.length} crawlable page shells.`);
