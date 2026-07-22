// One-time batch generator: calls OpenAI's image API for every entry in
// MANIFEST and writes the result to public/images/... The API key is read
// from the OPENAI_API_KEY env var only — never hardcoded, never written to
// disk. Run with:
//   OPENAI_API_KEY=sk-... node scripts/generate-ai-images.mjs
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  console.error('Missing OPENAI_API_KEY environment variable.')
  process.exit(1)
}

// Shared style suffix keeps every image consistent with the site's navy /
// electric-blue premium brand and avoids AI-image pitfalls (garbled text,
// implied real people/logos) for content that shouldn't read as documentary.
const STYLE = `
Professional editorial photography style, shot on a full-frame camera with a
shallow depth of field. Color grading in deep navy blue and cool electric
blue tones with subtle contrast, premium and cinematic, minimal and modern.
No readable text, no logos, no brand names, no watermarks. No close-up faces
or identifiable individuals — if people appear, they are anonymous, distant,
or motion-blurred silhouettes as part of the environment, not the subject.
Wide or three-quarter angle, clean composition, generous negative space
suitable for a website background.
`.trim().replace(/\s+/g, ' ')

const MANIFEST = [
  // --- Hero ---
  {
    outPath: 'public/images/hero/home-hero.png',
    size: '1536x1024',
    prompt: `A large-scale professional event production in progress: a grand
    stage with a massive LED video wall backdrop glowing deep blue, moving
    stage lights cutting through haze, truss rigging overhead, shot from the
    back of a large dark venue toward the stage. Conveys scale, technical
    precision, and a live international corporate event. ${STYLE}`,
  },

  // --- Equipment (3 per category) ---
  ...equipmentManifest(),

  // --- Industries ---
  { slug: 'international-companies', prompt: 'A sleek modern corporate boardroom with floor-to-ceiling windows overlooking a city skyline, a long conference table, a large presentation screen glowing blue, empty and pristine, conveying international corporate scale.' },
  { slug: 'japanese-corporations', prompt: 'A wide shot of a modern Tokyo office tower district at dusk, glass corporate buildings with lights on, blue-hour sky, conveying established Japanese corporate enterprise.' },
  { slug: 'event-agencies', prompt: 'A creative event-planning workspace: a large table covered with venue floor plans, a laptop showing a stage design, swatches and a scale model of a stage, overhead lighting, conveying meticulous event design work.' },
  { slug: 'exhibition-organizers', prompt: 'A vast empty convention center exhibition hall before doors open, rows of partially built exhibitor booths, high ceiling with exposed rigging and lighting trusses, dramatic wide angle, conveying scale and logistics.' },
  { slug: 'government-organizations', prompt: 'A formal large conference hall set up for an international summit, rows of delegate seating with microphones, a stage with flags subtly out of focus in the background, symmetrical composition, formal atmosphere.' },
  { slug: 'universities', prompt: 'A large modern university auditorium during a symposium, tiered seating mostly in silhouette, a speaker at a podium lit dramatically on stage, screens displaying abstract data visualizations, academic and prestigious mood.' },
  { slug: 'hotels', prompt: 'An elegant hotel ballroom set for a formal gala dinner, round tables with centerpieces, a stage with soft blue uplighting in the background, chandeliers, luxurious and refined atmosphere, wide angle.' },
  { slug: 'mice-clients', prompt: 'A modern multi-purpose conference and exhibition venue, an atrium with people walking as motion-blurred silhouettes between sessions, glass architecture, screens showing wayfinding information, conveying a MICE convention environment.' },
  { slug: 'luxury-brands', prompt: 'A minimalist luxury product launch stage: a single dramatically lit pedestal on a dark stage with a soft blue spotlight, smoke haze, premium and exclusive mood, extreme minimalism, no product visible on the pedestal.' },

  // --- Blog covers ---
  { dir: 'blog', slug: 'choosing-the-right-led-pixel-pitch', prompt: 'An extreme close-up of an LED video wall panel showing individual diode clusters in sharp detail, glowing blue and white, technical and precise, shallow depth of field.' },
  { dir: 'blog', slug: 'planning-events-in-japan-what-international-teams-miss', prompt: 'A wide shot of a Tokyo cityscape at blue hour seen through a conference room window, with a blurred meeting table and laptop in the foreground, conveying international business planning in Japan.' },
  { dir: 'blog', slug: 'why-hybrid-events-need-two-production-teams', prompt: 'A split-feel composition showing a technical control desk with multiple monitors displaying a live stage broadcast, operators visible only as silhouettes, blue monitor glow, conveying hybrid broadcast production.' },
  { dir: 'blog', slug: 'a-practical-timeline-for-booking-event-production', prompt: 'A clean overhead flat-lay of a production planning desk: a printed event timeline, a stopwatch, a pen, and a blueprint of a stage layout, soft directional light, organized and precise.' },
  { dir: 'blog', slug: 'inside-a-trade-show-build-nine-hour-load-in', prompt: 'A wide-angle action shot of an exhibition booth mid-construction, truss being rigged overhead, cases and equipment on the floor, motion-blurred crew silhouettes working quickly, dramatic work-in-progress energy.' },
  { dir: 'blog', slug: 'simultaneous-interpretation-what-planners-need-to-know', prompt: 'The interior of a simultaneous interpretation booth, a headset and microphone on a small desk facing a glass window overlooking a conference hall, focused and professional mood.' },
  { dir: 'blog', slug: 'total-media-expands-nationwide-equipment-inventory', prompt: 'A large equipment warehouse with organized rows of flight cases, coiled cables, and stacked LED panels under bright industrial lighting, conveying scale of inventory.' },
  { dir: 'blog', slug: 'why-redundancy-is-the-most-underrated-streaming-line-item', prompt: 'A broadcast technical control room with dual monitor walls showing waveform and network signal graphics in blue tones, redundant equipment racks with blinking status lights, technical and precise mood.' },

  // --- Solutions ---
  { dir: 'solutions', slug: 'hybrid-virtual-solutions', prompt: 'A hybrid event stage viewed simultaneously with a broadcast camera and monitor in the foreground showing the same stage on screen, conveying a dual in-person and virtual audience production.' },
  { dir: 'solutions', slug: 'large-format-visual-solutions', prompt: 'A massive curved LED video wall spanning an entire stage backdrop, glowing with abstract blue light patterns, dwarfing a small stage in front of it, conveying large-format visual scale.' },
  { dir: 'solutions', slug: 'broadcast-streaming-solutions', prompt: 'A multi-camera broadcast production setup on an event floor, professional cinema cameras on tripods pointed at a stage, cables running to a control point, conveying television-grade live production.' },
  { dir: 'solutions', slug: 'full-service-technical-solutions', prompt: 'A wide establishing shot of a fully built technical production: stage, LED wall, truss-mounted lighting, and speaker arrays all visible together in one dark venue, conveying total integrated technical scale.' },
].map((entry) => normalizeEntry(entry))

function equipmentManifest() {
  const categories = [
    { slug: 'indoor-led', prompts: [
      'A close-up of a fine-pitch indoor LED video wall panel glowing with abstract blue and white light, seamless panel joins visible, technical precision.',
      'A curved indoor LED stage backdrop wall fully built in a dark venue, glowing with a blue gradient, wide angle showing scale.',
      'A technician\'s point of view calibrating an indoor LED wall with a color meter device held up to the glowing panel, focused technical work.',
    ]},
    { slug: 'outdoor-led', prompts: [
      'A large outdoor LED screen at dusk in an open plaza, glowing brightly against a darkening sky, weatherproof housing visible.',
      'A wide shot of an outdoor LED stage screen at a ceremony setup, bright and clear under daylight, empty seating in foreground.',
      'A close-up of weatherproof outdoor LED panel housing with visible seals and mounting hardware, industrial and rugged.',
    ]},
    { slug: 'audio', prompts: [
      'A line array of professional PA speakers rigged and flown above a stage, dark venue, subtle blue stage light in the background.',
      'A digital audio mixing console with illuminated faders and a technician\'s hands adjusting levels, blue LED meter glow.',
      'A row of wireless microphone transmitters and receivers on a rack shelf, small LED indicator lights glowing, technical close-up.',
    ]},
    { slug: 'lighting', prompts: [
      'A row of moving-head stage lighting fixtures mounted on truss, beams of blue and white light cutting through haze.',
      'A lighting programmer\'s console with illuminated faders and a small preview screen showing a lighting cue, blue ambient glow.',
      'A close-up of an LED wash light fixture glowing intense blue, shallow depth of field, industrial design detail visible.',
    ]},
    { slug: 'stage', prompts: [
      'A modular stage deck platform system partially assembled on a venue floor, aluminum frame and black decking, wide angle.',
      'An empty finished stage with black decking and subtle blue edge lighting, wide shot of a dark venue.',
      'A close-up of stage deck leg hardware and adjustable height mechanisms, technical and precise.',
    ]},
    { slug: 'truss', prompts: [
      'A ground-supported box truss tower structure being assembled, aluminum segments and rigging clips visible, industrial.',
      'A wide shot of truss spans overhead in a dark venue with lighting fixtures mounted, motorized hoists visible.',
      'A close-up of truss connector clamps and safety cables, technical rigging hardware detail.',
    ]},
    { slug: 'projectors', prompts: [
      'A large professional laser projector unit on a stand, lens glowing with a faint blue beam visible in haze, dark room.',
      'A close-up of a projector lens and vents with a soft blue light beam emitting, technical product detail.',
      'A projector mounted on a truss beam pointed down at an angle toward an unseen screen, rigging clamp visible.',
    ]},
    { slug: 'displays', prompts: [
      'A row of digital signage displays on floor stands in a modern lobby, each glowing with abstract blue wayfinding graphics.',
      'A large modular video wall made of multiple screens tiled together, glowing with an abstract blue pattern, narrow bezels visible.',
      'A close-up of a freestanding touchscreen kiosk in an exhibition hall, screen glowing blue, sleek modern housing.',
    ]},
    { slug: 'cameras', prompts: [
      'A professional broadcast camera on a tripod pointed at a stage, operator visible only as a silhouette behind it, dark venue.',
      'A PTZ camera mounted on a ceiling bracket in a conference room, small status light glowing, clean modern room in background.',
      'A close-up of a cinema camera body with cables connected, blue rim light, technical product photography.',
    ]},
    { slug: 'accessories', prompts: [
      'A row of black flight cases stacked in a warehouse, foam-fitted interiors partially visible, organized and professional.',
      'A power distribution unit rack with cables neatly routed and labeled, indicator lights glowing, technical infrastructure.',
      'A cable ramp laid across a venue floor with neatly bundled cables running into it, safety yellow stripes, wide angle.',
    ]},
  ]

  return categories.flatMap((cat) =>
    cat.prompts.map((prompt, i) => ({
      dir: 'equipment',
      slug: `${cat.slug}-${i + 1}`,
      prompt,
    })),
  )
}

function normalizeEntry(entry) {
  if (entry.outPath) return entry
  return {
    outPath: `public/images/${entry.dir}/${entry.slug}.png`,
    size: entry.size ?? '1536x1024',
    prompt: `${entry.prompt} ${STYLE}`,
  }
}

async function generateOne(entry, index, total) {
  const outFile = path.join(root, entry.outPath)
  await mkdir(path.dirname(outFile), { recursive: true })

  console.log(`[${index + 1}/${total}] generating ${entry.outPath}...`)

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: entry.prompt,
      size: entry.size,
      quality: 'medium',
      n: 1,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${entry.outPath}: ${res.status} ${text}`)
  }

  const json = await res.json()
  const b64 = json.data?.[0]?.b64_json
  if (!b64) throw new Error(`${entry.outPath}: no image data returned`)

  await writeFile(outFile, Buffer.from(b64, 'base64'))
  console.log(`  -> wrote ${entry.outPath}`)
}

const results = { ok: [], failed: [] }
for (let i = 0; i < MANIFEST.length; i++) {
  try {
    await generateOne(MANIFEST[i], i, MANIFEST.length)
    results.ok.push(MANIFEST[i].outPath)
  } catch (err) {
    console.error(`  ! FAILED ${MANIFEST[i].outPath}:`, err.message)
    results.failed.push({ path: MANIFEST[i].outPath, error: err.message })
  }
}

console.log(`\nDone. ${results.ok.length} succeeded, ${results.failed.length} failed.`)
if (results.failed.length > 0) {
  console.log('Failed:', JSON.stringify(results.failed, null, 2))
  process.exit(1)
}
