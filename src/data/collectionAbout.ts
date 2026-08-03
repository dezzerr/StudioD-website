export interface CollectionAbout {
  headline: string;
  paragraphs: string[];
  highlights: { label: string; description: string }[];
}

export const collectionAbout: Record<string, CollectionAbout> = {
  'studio-portraits': {
    headline: 'Portraits That Reveal the Real You',
    paragraphs: [
      'A great portrait doesn\'t just show what you look like — it shows who you are. At StudioD, every studio portrait session is built around bringing out your authentic self, whether that\'s quiet confidence, bold energy, or something in between.',
      'Our controlled studio environment means we shape every shadow, every highlight, and every reflection to flatter you perfectly. No harsh sunlight, no unpredictable weather, no distractions — just pure, intentional lighting crafted to make you look your absolute best.',
      'With over 12 years and 500+ sessions of experience, we know how to guide you through poses, expressions, and wardrobe choices that work for your face, your body, and your personal brand. You don\'t need to be a model. You just need to show up — we\'ll handle the rest.',
    ],
    highlights: [
      { label: 'Controlled Studio Lighting', description: 'Every shadow and highlight shaped to flatter you' },
      { label: 'Pose & Expression Guidance', description: 'Directed throughout so you never feel lost' },
      { label: 'Wardrobe Consultation', description: 'Advice on outfits, colours, and styling that works' },
      { label: 'Professional to Creative', description: 'From clean corporate headshots to bold artistic portraits' },
    ],
  },
  'family-sessions': {
    headline: 'Family Moments Worth Holding Onto',
    paragraphs: [
      'Family photography shouldn\'t feel like a chore — it should feel like a memory being made. That\'s the philosophy behind every family session at StudioD. We create a relaxed, pressure-free environment where kids can be kids, parents can breathe, and genuine moments happen naturally.',
      'Whether it\'s in our studio or at a location of your choosing, we focus on connection over posing. The best family portraits aren\'t the ones where everyone is staring stiffly at the camera — they\'re the ones where you\'re laughing together, holding each other, and being yourselves.',
      'These are images you\'ll have for a lifetime. We treat them that way — heirloom-quality photographs that capture this season of your family\'s story, printed and delivered with the care it deserves.',
    ],
    highlights: [
      { label: 'Studio or On-Location', description: 'Choose the setting that feels most like home' },
      { label: 'Kid-Friendly Approach', description: 'Patient, playful sessions that keep children comfortable' },
      { label: 'Natural & Candid Style', description: 'Real moments over stiff, forced poses' },
      { label: 'Heirloom-Quality Results', description: 'Images designed to be treasured for generations' },
    ],
  },
  'event-photography': {
    headline: 'Event Coverage That Tells the Full Story',
    paragraphs: [
      'Events are lived in moments — a shared glance, a spontaneous laugh, the energy of a room full of people celebrating something that matters. Our event photography captures all of it, not just the planned shots but the in-between seconds that make the story real.',
      'We work discreetly, moving through your event without disrupting it. You\'ll barely notice we\'re there, but you\'ll see everything when you get your gallery — the big moments, the quiet ones, and the ones you missed because you were too busy enjoying yourself.',
      'From private celebrations to corporate functions, we bring the same editorial eye that shapes our portrait work. The result is a collection of images that don\'t just document your event — they convey what it felt like to be there.',
    ],
    highlights: [
      { label: 'Discreet, Unobtrusive Coverage', description: 'We capture the moment without interrupting it' },
      { label: 'Editorial-Quality Images', description: 'Every shot held to the same standard as our portrait work' },
      { label: 'Private & Commercial Events', description: 'From intimate gatherings to large-scale functions' },
      { label: 'Comprehensive Storytelling', description: 'Big moments, candid details, and everything in between' },
    ],
  },
};
