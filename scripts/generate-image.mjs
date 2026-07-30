// Generates an image with FLUX.1-schnell via the Hugging Face Inference API,
// converts it to WebP, and writes it into public/images/.
// Run with: node scripts/generate-image.mjs "<prompt>" <output-name> [width] [height]
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
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

const [prompt, outputName, width, height] = process.argv.slice(2)
if (!prompt || !outputName) {
  console.error('Usage: node scripts/generate-image.mjs "<prompt>" <output-name> [width] [height]')
  process.exit(1)
}

const outPath = path.join(root, 'public', 'images', `${outputName}.webp`)
await mkdir(path.dirname(outPath), { recursive: true })

const client = new InferenceClient(HF_TOKEN)

const blob = await client.textToImage({
  model: 'black-forest-labs/FLUX.1-schnell',
  inputs: prompt,
  parameters: {
    ...(width ? { width: Number(width) } : {}),
    ...(height ? { height: Number(height) } : {}),
  },
})

const buffer = Buffer.from(await blob.arrayBuffer())
await sharp(buffer).webp({ quality: 90 }).toFile(outPath)

console.log('wrote', path.relative(root, outPath))
