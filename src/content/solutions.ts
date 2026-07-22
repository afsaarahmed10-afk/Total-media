import type { Solution } from './types'

export const solutions: Solution[] = [
  {
    id: 'sol-hybrid-virtual',
    slug: 'hybrid-virtual-solutions',
    name: 'Hybrid & Virtual Event Solutions',
    shortDescription:
      'A packaged approach to running in-room and remote audiences as one production, from platform selection through live broadcast direction.',
    heroStatement: 'For organizations whose audience is never entirely in one room.',
    overview: [
      'Hybrid and virtual formats aren\'t a single service — they combine event planning, technical production, live streaming, and often interpretation into one dependency chain, where a gap in any part shows up live, in front of your audience.',
      'This solution bundles the disciplines that make hybrid and virtual events reliable: dual-audience content design, redundant streaming infrastructure, and a technical director whose sole responsibility is the broadcast, working alongside — not instead of — your in-room production team.',
    ],
    highlights: [
      { title: 'Dual-audience design', description: 'Content and camera plans built for the room and the stream from day one, not adapted afterward.' },
      { title: 'Redundant infrastructure', description: 'Dual internet circuits and backup encoding paths as standard, not an upsell.' },
      { title: 'Independent broadcast direction', description: 'A dedicated technical director for the stream, separate from in-room stage management.' },
      { title: 'Interpretation-ready', description: 'Simultaneous interpretation channels built into the broadcast for in-room and remote audiences alike.' },
    ],
    includedServiceSlugs: ['hybrid-events', 'virtual-events', 'live-streaming', 'technical-production'],
    seoTitle: 'Hybrid & Virtual Event Solutions in Japan | TOTAL MEDIA',
    seoDescription:
      'A packaged hybrid and virtual event solution across Japan — dual-audience design, redundant streaming, and independent broadcast direction.',
  },
  {
    id: 'sol-visual-led',
    slug: 'large-format-visual-solutions',
    name: 'Large-Format Visual & LED Solutions',
    shortDescription:
      'LED, projection, and lighting bundled as one visual system, specified together instead of sourced separately.',
    heroStatement: 'For events where the visual scale is the point.',
    overview: [
      'Large-format visual moments — a keynote backdrop, an exhibition centerpiece, an outdoor ceremony screen — depend on LED, lighting, and often projection working as one coordinated system, not three separately rented components pointed at the same stage.',
      'This solution combines pitch-specified LED, cue-based lighting design, and rigging engineering into a single visual production plan, so color, brightness, and cueing are consistent across every element the audience sees at once.',
    ],
    highlights: [
      { title: 'One visual system', description: 'LED, lighting, and projection specified and calibrated together, not independently.' },
      { title: 'Rigging engineered as one build', description: 'Structural load calculated across every visual element sharing the same truss.' },
      { title: 'Content and cue integration', description: 'Media playback and lighting cues synced to the same run-of-show.' },
      { title: 'Indoor and outdoor capable', description: 'Weatherproof options for ceremonies and activations outside the venue walls.' },
    ],
    includedServiceSlugs: ['led-solutions', 'lighting-solutions', 'stage-production'],
    seoTitle: 'Large-Format LED & Visual Solutions in Japan | TOTAL MEDIA',
    seoDescription:
      'Large-format visual solutions across Japan — LED, lighting, and rigging engineered together as one coordinated visual system.',
  },
  {
    id: 'sol-broadcast-streaming',
    slug: 'broadcast-streaming-solutions',
    name: 'Broadcast & Streaming Solutions',
    shortDescription:
      'Multi-camera broadcast production and redundant live streaming bundled for events that need television-grade output.',
    heroStatement: 'For events that are being watched as much as they\'re being attended.',
    overview: [
      'Award ceremonies, product reveals, and press events increasingly live and die by what the camera captures, not just what happens in the room. This solution bundles multi-camera direction, broadcast-grade audio, and redundant streaming into one production discipline.',
      'We handle vision switching, live graphics, and multi-language audio channels alongside the underlying streaming infrastructure, so the broadcast output is a directed production, not a static camera pointed at a stage.',
    ],
    highlights: [
      { title: 'Multi-camera direction', description: 'Vision switching and shot composition handled by broadcast-trained camera operators.' },
      { title: 'Redundant delivery', description: 'Dual circuits and backup encoding as standard for anything broadcast-critical.' },
      { title: 'Live graphics and overlays', description: 'Lower-thirds, branding, and multi-language captions integrated live.' },
      { title: 'Platform-agnostic', description: 'Delivered to the platform your audience already uses, not a proprietary one.' },
    ],
    includedServiceSlugs: ['live-streaming', 'award-ceremonies', 'virtual-events'],
    seoTitle: 'Broadcast & Live Streaming Solutions in Japan | TOTAL MEDIA',
    seoDescription:
      'Broadcast and streaming solutions across Japan — multi-camera direction, redundant delivery, and live graphics for television-grade event output.',
  },
  {
    id: 'sol-full-technical',
    slug: 'full-service-technical-solutions',
    name: 'Full-Service Technical Production Solutions',
    shortDescription:
      'Every technical discipline — LED, audio, lighting, staging, rigging, cameras — under a single technical director.',
    heroStatement: 'For events large enough that coordination is the actual risk.',
    overview: [
      'At a certain scale, the biggest risk to an event isn\'t any single technical system — it\'s the coordination between them. Power allocated for lighting that clashes with LED draw. Camera positions that block a sightline the audio team already claimed. Rigging points double-booked between two vendors.',
      'This solution puts every technical discipline under one technical director and one integrated build plan, backed by our full equipment inventory rather than subcontracted pieces, so the seams between systems are our responsibility, not yours to manage.',
    ],
    highlights: [
      { title: 'One technical director', description: 'A single point of accountability across every technical discipline on-site.' },
      { title: 'Integrated build plan', description: 'Power, rigging, and cueing planned together across LED, audio, lighting, and staging.' },
      { title: 'Full in-house inventory', description: 'Equipment drawn from our own catalogue, not subcontracted piecemeal.' },
      { title: 'Contingency-ready', description: 'Backup systems and a technical team empowered to problem-solve live.' },
    ],
    includedServiceSlugs: ['technical-production', 'stage-production', 'led-solutions', 'audio-solutions', 'lighting-solutions'],
    seoTitle: 'Full-Service Technical Production Solutions in Japan | TOTAL MEDIA',
    seoDescription:
      'Full-service technical production solutions across Japan — every discipline, from LED to rigging to cameras, under one technical director.',
  },
]
