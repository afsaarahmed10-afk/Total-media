import type { EquipmentCategory } from './types'

export const equipmentCategories: EquipmentCategory[] = [
  {
    id: 'ec-led-indoor',
    slug: 'indoor-led',
    name: 'Indoor LED',
    description:
      'Fine-pitch indoor LED panels for stage backdrops, exhibition walls, and broadcast-grade displays, sized and pitched to viewing distance.',
  },
  {
    id: 'ec-led-outdoor',
    slug: 'outdoor-led',
    name: 'Outdoor LED',
    description:
      'Weatherproof, high-brightness LED for outdoor stages, ceremonies, and large-format brand activations that need to hold up in daylight.',
  },
  {
    id: 'ec-audio',
    slug: 'audio',
    name: 'Audio Systems',
    description:
      'Line array PA, monitor systems, digital mixing, wireless microphones, and interpretation audio, specified to room size and program type.',
  },
  {
    id: 'ec-lighting',
    slug: 'lighting',
    name: 'Lighting Systems',
    description:
      'Moving lights, architectural wash, and console-driven programming for stage lighting, keynote lighting, and ambient venue design.',
  },
  {
    id: 'ec-stage',
    slug: 'stage',
    name: 'Stage & Set',
    description:
      'Modular staging, decking, and custom set elements engineered to venue load limits and built to strike as fast as they go up.',
  },
  {
    id: 'ec-truss',
    slug: 'truss',
    name: 'Truss & Rigging',
    description:
      'Ground support and motorized rigging systems for LED, lighting, and speaker arrays, signed off against certified load calculations.',
  },
  {
    id: 'ec-projectors',
    slug: 'projectors',
    name: 'Projectors',
    description:
      'High-lumen laser projection for stage backdrops, projection mapping, and large-venue rear or front projection.',
  },
  {
    id: 'ec-displays',
    slug: 'displays',
    name: 'Displays & Signage',
    description:
      'Freestanding and mounted displays for wayfinding, registration, exhibition booths, and digital signage networks.',
  },
  {
    id: 'ec-cameras',
    slug: 'cameras',
    name: 'Camera Systems',
    description:
      'Broadcast and PTZ camera systems, vision switching, and live production kits for streaming, recording, and IMAG.',
  },
  {
    id: 'ec-accessories',
    slug: 'accessories',
    name: 'Accessories & Support',
    description:
      'Power distribution, cabling, cases, and the technical support infrastructure that keeps a production running end to end.',
  },
]
