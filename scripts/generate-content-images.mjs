// One-off batch: generates cover photos for every service, solution,
// equipment category, portfolio project, and blog post that's still showing
// the AbstractVisual gradient placeholder. Uploads each file to the "media"
// Storage bucket via the linked Supabase CLI (works without login/service
// key), then writes a single SQL script linking each upload to its content
// row — DB writes aren't run here; the SQL file is meant to be reviewed and
// run separately (Supabase SQL editor, or `npx supabase db query --linked`).
//
// Run with: node scripts/generate-content-images.mjs
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { InferenceClient } from '@huggingface/inference'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')

if (!process.env.HF_TOKEN) {
  try {
    process.loadEnvFile(path.join(root, '.env.local'))
  } catch {
    // fall through; the check below reports the real problem
  }
}
const HF_TOKEN = process.env.HF_TOKEN
if (!HF_TOKEN) {
  console.error('HF_TOKEN is not set (checked process.env and .env.local).')
  process.exit(1)
}

const STYLE_PREFIX =
  'Professional editorial photograph for a corporate event production company in Japan. Realistic, natural lighting, no on-image text, no logos, no watermarks, no visible faces looking directly at camera. '

// cover_media_id tables: single photo per row.
const coverItems = [
  // services
  { table: 'services', slug: 'corporate-events', prompt: 'A modern corporate town hall event, employees seated in rows facing a lit stage with a large screen, professional conference room.', alt: 'Corporate town hall event on stage' },
  { table: 'services', slug: 'conferences', prompt: 'A large conference hall with rows of attendees watching a keynote speaker on a well-lit stage with big screens.', alt: 'Conference keynote stage with audience' },
  { table: 'services', slug: 'exhibitions', prompt: 'An exhibition hall booth with an LED display wall and branded signage, trade show floor with attendees walking by.', alt: 'Exhibition booth with LED display wall' },
  { table: 'services', slug: 'trade-shows', prompt: 'A convention center trade show floor with multiple exhibition booths and a large crowd walking between displays.', alt: 'Convention center trade show floor' },
  { table: 'services', slug: 'product-launches', prompt: 'A dramatic product reveal on stage with a bright spotlight and haze effect, press photographers in the front row.', alt: 'Product launch stage reveal with spotlight' },
  { table: 'services', slug: 'award-ceremonies', prompt: 'A formal award ceremony stage with a podium and trophy, warm stage lighting, elegant ballroom setting.', alt: 'Award ceremony stage with podium' },
  { table: 'services', slug: 'virtual-events', prompt: 'A broadcast studio setup with multiple cameras, a presenter at a desk, professional lighting rig, screens showing remote speakers.', alt: 'Virtual event broadcast studio setup' },
  { table: 'services', slug: 'hybrid-events', prompt: 'A conference stage with an in-person audience and a large side screen showing remote video call attendees, hybrid event production.', alt: 'Hybrid event stage with remote attendees on screen' },
  { table: 'services', slug: 'live-streaming', prompt: 'A technical director at a video switcher console with a wall of live feed monitors during an event broadcast.', alt: 'Live streaming technical director at switcher console' },
  { table: 'services', slug: 'led-solutions', prompt: 'A massive curved LED video wall on a stage glowing with vibrant colors, technicians working nearby.', alt: 'Large curved LED video wall on stage' },
  { table: 'services', slug: 'audio-solutions', prompt: 'A professional audio mixing console and line array speaker stacks set up at a large event venue.', alt: 'Audio mixing console and line array speakers' },
  { table: 'services', slug: 'lighting-solutions', prompt: 'Moving head stage lights and colorful beams illuminating an empty concert stage before a show.', alt: 'Moving head stage lighting beams' },
  { table: 'services', slug: 'stage-production', prompt: 'A large modular stage build with truss rigging, backdrop, and crew members during setup.', alt: 'Modular stage build with truss rigging' },
  { table: 'services', slug: 'technical-production', prompt: 'A backstage technical crew working among cables, rigging, and equipment cases before an event.', alt: 'Backstage technical production crew' },
  { table: 'services', slug: 'event-consultation', prompt: 'Two professionals reviewing an event floor plan and blueprints on a table in a meeting room.', alt: 'Event consultation meeting with floor plans' },

  // solutions
  { table: 'solutions', slug: 'hybrid-virtual-solutions', prompt: 'A conference stage with an in-room audience and a control desk showing remote broadcast monitors, technical director overseeing both.', alt: 'Hybrid and virtual event production control desk' },
  { table: 'solutions', slug: 'large-format-visual-solutions', prompt: 'A massive curved LED screen with synchronized stage lighting and projection at a large-scale event.', alt: 'Large-format LED and lighting visual system' },
  { table: 'solutions', slug: 'broadcast-streaming-solutions', prompt: 'A broadcast production control room interior with a wall of live camera feed monitors and a vision switcher.', alt: 'Broadcast and streaming production control room' },
  { table: 'solutions', slug: 'full-service-technical-solutions', prompt: 'A wide venue shot showing integrated LED screens, stage lighting, staging, and rigging all in one large-scale production.', alt: 'Full-service technical production venue' },

  // equipment categories
  { table: 'equipment_categories', slug: 'indoor-led', prompt: 'Fine-pitch indoor LED video wall panels being assembled backstage at an event venue.', alt: 'Indoor LED video wall panels' },
  { table: 'equipment_categories', slug: 'outdoor-led', prompt: 'A large outdoor LED screen at a daylight outdoor ceremony, weatherproof rigging visible.', alt: 'Outdoor weatherproof LED screen' },
  { table: 'equipment_categories', slug: 'audio', prompt: 'Line array speaker stacks and a digital mixing console at a large event venue.', alt: 'Line array speakers and digital mixing console' },
  { table: 'equipment_categories', slug: 'lighting', prompt: 'Moving head lighting fixtures and a truss rig glowing with colorful beams on an empty stage.', alt: 'Moving head lighting fixtures on truss rig' },
  { table: 'equipment_categories', slug: 'stage', prompt: 'Modular stage decking and platform sections being assembled for an event.', alt: 'Modular stage decking and platforms' },
  { table: 'equipment_categories', slug: 'truss', prompt: 'Motorized chain hoists and box truss rigging suspended above an event stage.', alt: 'Truss and rigging system above a stage' },
  { table: 'equipment_categories', slug: 'projectors', prompt: 'A high-lumen laser projector aimed at a large screen in a dark venue, projection beam visible.', alt: 'High-lumen laser projector in a dark venue' },
  { table: 'equipment_categories', slug: 'displays', prompt: 'Freestanding digital signage and touch kiosk displays in an exhibition hall.', alt: 'Digital signage and touch kiosk displays' },
  { table: 'equipment_categories', slug: 'cameras', prompt: 'Broadcast PTZ cameras and a vision switcher set up at a conference stage.', alt: 'Broadcast PTZ cameras at a conference stage' },
  { table: 'equipment_categories', slug: 'accessories', prompt: 'Power distribution cases, cable runs, and technical flight cases backstage at an event.', alt: 'Power distribution and flight cases backstage' },

  // blog posts
  { table: 'blog_posts', slug: 'choosing-the-right-led-pixel-pitch', prompt: 'A close-up of a fine-pitch LED video wall panel showing individual diode clusters, technical detail shot.', alt: 'Close-up of fine-pitch LED panel' },
  { table: 'blog_posts', slug: 'planning-events-in-japan-what-international-teams-miss', prompt: 'A business planning meeting around a table with a Tokyo city skyline visible through large windows.', alt: 'Business meeting with Tokyo skyline view' },
  { table: 'blog_posts', slug: 'why-hybrid-events-need-two-production-teams', prompt: 'Two technical directors working side by side, one watching a stage and one watching a broadcast monitor wall.', alt: 'Two technical directors managing a hybrid event' },
  { table: 'blog_posts', slug: 'a-practical-timeline-for-booking-event-production', prompt: 'An event planner reviewing a calendar and timeline documents spread out on a desk.', alt: 'Event planner reviewing a booking timeline' },
  { table: 'blog_posts', slug: 'inside-a-trade-show-build-nine-hour-load-in', prompt: 'An exhibition crew building a trade show booth structure with truss rigging and LED panels mid-construction.', alt: 'Trade show booth under construction' },
  { table: 'blog_posts', slug: 'simultaneous-interpretation-what-planners-need-to-know', prompt: 'An interpretation booth with headphones and audio equipment overlooking a conference stage.', alt: 'Simultaneous interpretation booth overlooking a stage' },
  { table: 'blog_posts', slug: 'total-media-expands-nationwide-equipment-inventory', prompt: 'A warehouse full of stacked LED panels, lighting cases, and rigging equipment inventory.', alt: 'Warehouse of stacked event equipment inventory' },
  { table: 'blog_posts', slug: 'why-redundancy-is-the-most-underrated-streaming-line-item', prompt: 'A technical rack of redundant streaming encoders and network switches with cables.', alt: 'Rack of redundant streaming encoders' },
]

// project_images join table: one photo per project, tied to its location.
const projectItems = [
  { slug: 'meridian-robotics-apac-summit', prompt: 'A hybrid corporate summit in a Tokyo conference hall, in-room audience with a large side screen showing remote attendees.', alt: 'Hybrid corporate summit in Tokyo' },
  { slug: 'ridgeline-semiconductor-tech-expo', prompt: 'An exhibition booth with a curved LED centerpiece display at a tech expo trade show floor in Osaka.', alt: 'Tech expo booth with curved LED centerpiece' },
  { slug: 'sakura-financial-annual-meeting', prompt: 'A formal shareholder annual general meeting in a large Tokyo conference hall, board members seated on stage.', alt: 'Shareholder annual general meeting in Tokyo' },
  { slug: 'lumen-cosmetics-flagship-launch', prompt: 'An elegant cosmetics product launch event with a dramatic stage lighting reveal and press photographers.', alt: 'Cosmetics product launch stage reveal' },
  { slug: 'nordholm-pharmaceuticals-research-symposium', prompt: 'An international research symposium conference hall in Yokohama with an interpretation booth visible at the side.', alt: 'Research symposium conference hall in Yokohama' },
  { slug: 'orbit-mobility-outdoor-groundbreaking', prompt: 'An outdoor groundbreaking ceremony on a construction site in Nagoya with a large weatherproof LED screen in daylight.', alt: 'Outdoor groundbreaking ceremony with LED screen' },
  { slug: 'vantage-capital-investor-briefing', prompt: 'A broadcast studio set with multi-camera coverage for a virtual investor briefing production in Tokyo.', alt: 'Broadcast studio set for investor briefing' },
  { slug: 'tsukiyo-hospitality-anniversary-gala', prompt: 'A formal anniversary gala with ambient lighting design in an elegant ballroom in Kyoto.', alt: 'Anniversary gala in an elegant Kyoto ballroom' },
]

// equipment_images join table: one product-style photo per equipment item.
const equipmentItemItems = [
  { slug: 'indoor-led-p1-9-fine-pitch', prompt: 'A close-up product photo of a fine-pitch indoor LED panel module, showing seamless cabinet joins, studio lighting.', alt: 'P1.9 fine-pitch indoor LED panel' },
  { slug: 'indoor-led-p2-6-standard', prompt: 'A product photo of a standard indoor LED wall panel cabinet, stacked and ready for deployment, studio lighting.', alt: 'P2.6 indoor LED panel' },
  { slug: 'indoor-led-p3-9-rental', prompt: 'A product photo of large indoor LED rental wall panels being assembled into a curved configuration.', alt: 'P3.9 indoor rental LED panel' },
  { slug: 'outdoor-led-p3-9-weatherproof', prompt: 'A product photo of a weatherproof outdoor LED panel cabinet with visible sealed housing, daylight setting.', alt: 'P3.9 outdoor weatherproof LED panel' },
  { slug: 'outdoor-led-p4-8-screen', prompt: 'A large outdoor LED screen system installed at an event site, bright daylight conditions.', alt: 'P4.8 outdoor LED screen' },
  { slug: 'outdoor-led-p6-6-wall', prompt: 'A large-format outdoor LED wall at stadium scale, wide shot showing multiple panels joined.', alt: 'P6.6 outdoor LED wall' },
  { slug: 'audio-line-array-pa', prompt: 'A line array PA speaker system flown above a stage, rigging visible, concert venue setting.', alt: 'Line array PA speaker system' },
  { slug: 'audio-digital-mixing-console', prompt: 'A close-up product photo of a digital mixing console with illuminated faders and channel strips.', alt: 'Digital mixing console' },
  { slug: 'audio-wireless-microphone-system', prompt: 'A product photo of wireless handheld and lavalier microphones laid out with a charging dock.', alt: 'Wireless microphone system' },
  { slug: 'lighting-moving-head-spot', prompt: 'A close-up product photo of a moving head spot light fixture on truss, lens and yoke visible.', alt: 'Moving head spot light fixture' },
  { slug: 'lighting-led-wash', prompt: 'A product photo of an LED wash light fixture casting a wide colorful beam on a dark stage.', alt: 'LED wash light fixture' },
  { slug: 'lighting-console', prompt: 'A close-up product photo of a lighting control console with illuminated faders, operator hands visible at the edge.', alt: 'Lighting control console' },
  { slug: 'stage-modular-deck', prompt: 'A product photo of modular stage decking platforms being assembled, adjustable legs visible.', alt: 'Modular stage decking system' },
  { slug: 'stage-riser-platform', prompt: 'A product photo of a freestanding stage riser platform used for panel seating, empty venue setting.', alt: 'Stage riser platform' },
  { slug: 'stage-runway', prompt: 'A long runway-style stage extending into an audience area, dramatic lighting, empty before a show.', alt: 'Runway catwalk stage' },
  { slug: 'truss-box-ground-support', prompt: 'A product photo of a self-supporting box truss ground support tower structure, indoor venue.', alt: 'Box truss ground support tower' },
  { slug: 'truss-motorized-hoist', prompt: 'A close-up product photo of a motorized chain hoist rigged on truss, cables and control box visible.', alt: 'Motorized chain hoist' },
  { slug: 'truss-tower-system', prompt: 'A tall vertical truss tower system supporting lighting fixtures at an outdoor event.', alt: 'Truss tower system' },
  { slug: 'projector-20000-lumen-laser', prompt: 'A close-up product photo of a large professional laser projector unit with lens, studio lighting.', alt: '20,000 lumen laser projector' },
  { slug: 'projector-10000-lumen-laser', prompt: 'A product photo of a mid-size laser projector unit on a stand in a conference room.', alt: '10,000 lumen laser projector' },
  { slug: 'projector-short-throw', prompt: 'A product photo of a compact short-throw projector positioned close to a screen in a small venue.', alt: 'Short-throw projector' },
  { slug: 'displays-55-inch-signage', prompt: 'A product photo of a freestanding 55 inch digital signage display at an event registration desk.', alt: '55 inch digital signage display' },
  { slug: 'displays-touch-kiosk', prompt: 'A product photo of an interactive touchscreen kiosk standing in an exhibition hall.', alt: 'Freestanding touch kiosk' },
  { slug: 'displays-video-wall', prompt: 'A large modular LCD video wall installation with narrow bezels in a lobby setting.', alt: 'Video wall display' },
  { slug: 'camera-ptz-system', prompt: 'A close-up product photo of a ceiling-mounted PTZ camera in a conference hall.', alt: 'PTZ camera system' },
  { slug: 'camera-broadcast-package', prompt: 'A broadcast camera on a tripod with an operator behind it, filming a stage event.', alt: 'Broadcast camera package' },
  { slug: 'camera-vision-switcher-kit', prompt: 'A close-up product photo of a multi-camera vision switcher control panel with monitor wall.', alt: 'Vision switcher and streaming kit' },
  { slug: 'accessories-power-distribution', prompt: 'A product photo of a power distribution board with cabling, backstage at an event.', alt: 'Power distribution system' },
  { slug: 'accessories-cable-management', prompt: 'A product photo of cable ramps and dressing laid across a public walkway at an event venue.', alt: 'Cable ramp and management kit' },
  { slug: 'accessories-flight-cases', prompt: 'A product photo of stacked black flight cases with foam-fitted equipment, loading dock setting.', alt: 'Flight case and transport package' },
]

function escapeSql(value) {
  return value.replace(/'/g, "''")
}

// The DB already has media rows (and cover/join links) for anything a
// previous run successfully applied via link-content-images.sql. Skip
// emitting SQL for those storage_paths so a rerun's SQL is a pure delta,
// not a duplicate-key error on media.storage_path.
const existingStoragePathsRaw = execFileSync(
  'npx',
  // shell:true only concatenates args (no escaping), so a multi-word SQL
  // string needs its own quotes or it gets word-split by the shell.
  ['supabase', 'db', 'query', '--linked', '"select storage_path from media;"'],
  { cwd: root, encoding: 'utf8', shell: true },
)
const existingStoragePaths = new Set(
  (JSON.parse(existingStoragePathsRaw.match(/\{[\s\S]*\}/)[0]).rows ?? []).map((r) => r.storage_path),
)
console.log(`${existingStoragePaths.size} storage paths already linked in the DB; skipping those in the new SQL.`)

const client = new InferenceClient(HF_TOKEN)
const sqlStatements = []
let succeeded = 0
let failed = 0

async function generateAndUpload(table, slug, prompt, alt) {
  const outDir = path.join(root, 'public', 'images', table)
  await mkdir(outDir, { recursive: true })
  const localPath = path.join(outDir, `${slug}.webp`)
  const storagePath = `${table}/${slug}.webp`

  let webpBuffer
  if (existsSync(localPath)) {
    console.log('reusing existing file:', path.relative(root, localPath))
    webpBuffer = await readFile(localPath)
  } else {
    const blob = await client.textToImage({
      model: 'black-forest-labs/FLUX.1-schnell',
      inputs: `${STYLE_PREFIX}${prompt}`,
    })
    const rawBuffer = Buffer.from(await blob.arrayBuffer())
    webpBuffer = await sharp(rawBuffer).webp({ quality: 90 }).toBuffer()
    await writeFile(localPath, webpBuffer)
  }
  const metadata = await sharp(webpBuffer).metadata()

  // The CLI misparses a Windows absolute path (e.g. "D:\...") as a URI
  // scheme, so pass a relative path instead (cwd is set to root below).
  const relativeLocalPath = `public/images/${table}/${slug}.webp`
  try {
    execFileSync(
      'npx',
      ['supabase', 'storage', 'cp', '--linked', '--experimental', relativeLocalPath, `ss:///media/${storagePath}`],
      { cwd: root, stdio: 'pipe', shell: true },
    )
  } catch (err) {
    const alreadyExists = /KeyAlreadyExists/.test(
      `${err.stdout?.toString() ?? ''}${err.stderr?.toString() ?? ''}${err.message ?? ''}`,
    )
    if (!alreadyExists) throw err
    console.log('already uploaded, reusing:', storagePath)
  }

  return {
    id: randomUUID(),
    storagePath,
    fileName: `${slug}.webp`,
    sizeBytes: webpBuffer.length,
    width: metadata.width,
    height: metadata.height,
    alt,
  }
}

for (const item of coverItems) {
  try {
    const media = await generateAndUpload(item.table, item.slug, item.prompt, item.alt)
    if (!existingStoragePaths.has(media.storagePath)) {
      sqlStatements.push(
        `insert into media (id, storage_path, file_name, mime_type, size_bytes, width, height, alt_text) values ('${media.id}', '${escapeSql(media.storagePath)}', '${escapeSql(media.fileName)}', 'image/webp', ${media.sizeBytes}, ${media.width}, ${media.height}, '${escapeSql(media.alt)}');`,
        `update ${item.table} set cover_media_id = '${media.id}' where slug = '${escapeSql(item.slug)}';`,
      )
    }
    console.log('done:', item.table, item.slug)
    succeeded++
  } catch (err) {
    console.error('FAILED:', item.table, item.slug, err.message, err.stderr?.toString(), err.stdout?.toString())
    failed++
  }
}

for (const item of projectItems) {
  try {
    const media = await generateAndUpload('projects', item.slug, item.prompt, item.alt)
    if (!existingStoragePaths.has(media.storagePath)) {
      sqlStatements.push(
        `insert into media (id, storage_path, file_name, mime_type, size_bytes, width, height, alt_text) values ('${media.id}', '${escapeSql(media.storagePath)}', '${escapeSql(media.fileName)}', 'image/webp', ${media.sizeBytes}, ${media.width}, ${media.height}, '${escapeSql(media.alt)}');`,
        `insert into project_images (project_id, media_id, sort_order) select id, '${media.id}', 0 from projects where slug = '${escapeSql(item.slug)}';`,
      )
    }
    console.log('done: projects', item.slug)
    succeeded++
  } catch (err) {
    console.error('FAILED: projects', item.slug, err.message, err.stderr?.toString(), err.stdout?.toString())
    failed++
  }
}

for (const item of equipmentItemItems) {
  try {
    const media = await generateAndUpload('equipment_items', item.slug, item.prompt, item.alt)
    if (!existingStoragePaths.has(media.storagePath)) {
      sqlStatements.push(
        `insert into media (id, storage_path, file_name, mime_type, size_bytes, width, height, alt_text) values ('${media.id}', '${escapeSql(media.storagePath)}', '${escapeSql(media.fileName)}', 'image/webp', ${media.sizeBytes}, ${media.width}, ${media.height}, '${escapeSql(media.alt)}');`,
        `insert into equipment_images (equipment_item_id, media_id, sort_order) select id, '${media.id}', 0 from equipment_items where slug = '${escapeSql(item.slug)}';`,
      )
    }
    console.log('done: equipment_items', item.slug)
    succeeded++
  } catch (err) {
    console.error('FAILED: equipment_items', item.slug, err.message, err.stderr?.toString(), err.stdout?.toString())
    failed++
  }
}

const sqlOutPath = path.join(root, 'scripts', 'link-content-images.sql')
await writeFile(
  sqlOutPath,
  `begin;\n\n${sqlStatements.join('\n')}\n\ncommit;\n`,
)

console.log(`\n${succeeded} succeeded, ${failed} failed.`)
console.log('SQL written to', path.relative(root, sqlOutPath))
