// One-time/rebuild-on-demand script: rasterizes the SVG brand marks into the
// PNG/ICO/OG assets referenced by index.html and social meta tags.
// Run with: node scripts/generate-brand-assets.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const brandDir = path.join(root, 'public', 'brand')
const publicDir = path.join(root, 'public')

const markSvg = await readFile(path.join(brandDir, 'logo-mark.svg'))
const tileSvg = await readFile(path.join(brandDir, 'logo-mark-tile.svg'))

await mkdir(brandDir, { recursive: true })

async function png(svgBuffer, size, outPath) {
  await sharp(svgBuffer, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(outPath)
  console.log('wrote', path.relative(root, outPath))
}

// Favicons (transparent mark, browser chrome supplies the background)
await png(markSvg, 32, path.join(publicDir, 'favicon-32x32.png'))
await png(markSvg, 16, path.join(publicDir, 'favicon-16x16.png'))

// App / touch icons (navy tile background, safe-area padded mark)
await png(tileSvg, 180, path.join(publicDir, 'apple-touch-icon.png'))
await png(tileSvg, 192, path.join(publicDir, 'icon-192.png'))
await png(tileSvg, 512, path.join(publicDir, 'icon-512.png'))

// ICO (multi-resolution) built from the same 32/16 renders
const ico16 = await sharp(markSvg, { density: 384 }).resize(16, 16).png().toBuffer()
const ico32 = await sharp(markSvg, { density: 384 }).resize(32, 32).png().toBuffer()
const ico48 = await sharp(markSvg, { density: 384 }).resize(48, 48).png().toBuffer()
await writeFile(path.join(publicDir, 'favicon.ico'), await pngsToIco([ico16, ico32, ico48]))
console.log('wrote', 'public/favicon.ico')

// Default OG/social share image (1200x630, navy field + lockup).
// Bars are drawn white/accent directly (not the navy on-light mark) since
// this sits on a dark field.
const ogWidth = 1200
const ogHeight = 630

const ogSvg = `
<svg width="${ogWidth}" height="${ogHeight}" viewBox="0 0 ${ogWidth} ${ogHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${ogWidth}" y2="${ogHeight}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0B1F3A"/>
      <stop offset="1" stop-color="#071429"/>
    </linearGradient>
  </defs>
  <rect width="${ogWidth}" height="${ogHeight}" fill="url(#bg)"/>

  <g transform="translate(90, 96)">
    <rect x="0" y="26" width="14" height="34" rx="3" fill="#FFFFFF"/>
    <rect x="24" y="14" width="14" height="46" rx="3" fill="#FFFFFF"/>
    <rect x="48" y="0" width="14" height="60" rx="3" fill="#2F6FEA"/>
    <rect x="72" y="16" width="14" height="44" rx="3" fill="#FFFFFF"/>
  </g>

  <text x="90" y="290" font-family="Arial, sans-serif" font-size="66" font-weight="800" letter-spacing="1" fill="#FFFFFF">TOTAL MEDIA</text>
  <text x="90" y="340" font-family="Arial, sans-serif" font-size="27" font-weight="400" letter-spacing="0.5" fill="#C7D2E5">Creating Exceptional Events Across Japan.</text>
  <rect x="90" y="380" width="64" height="4" fill="#2F6FEA"/>
</svg>
`

await sharp(Buffer.from(ogSvg))
  .png()
  .toFile(path.join(publicDir, 'og-default.png'))
console.log('wrote', 'public/og-default.png')

/** Minimal PNG-frames-to-ICO packer (no external ico dependency). */
async function pngsToIco(pngBuffers) {
  const headerSize = 6
  const dirEntrySize = 16
  const offsets = []
  let offset = headerSize + dirEntrySize * pngBuffers.length
  for (const buf of pngBuffers) {
    offsets.push(offset)
    offset += buf.length
  }

  const header = Buffer.alloc(headerSize)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(pngBuffers.length, 4)

  const dirEntries = []
  for (let i = 0; i < pngBuffers.length; i++) {
    const buf = pngBuffers[i]
    const meta = await sharp(buf).metadata()
    const entry = Buffer.alloc(dirEntrySize)
    const dim = meta.width >= 256 ? 0 : meta.width
    entry.writeUInt8(dim, 0) // width (0 = 256)
    entry.writeUInt8(dim, 1) // height
    entry.writeUInt8(0, 2) // color palette
    entry.writeUInt8(0, 3) // reserved
    entry.writeUInt16LE(1, 4) // color planes
    entry.writeUInt16LE(32, 6) // bits per pixel
    entry.writeUInt32LE(buf.length, 8) // size
    entry.writeUInt32LE(offsets[i], 12) // offset
    dirEntries.push(entry)
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers])
}
