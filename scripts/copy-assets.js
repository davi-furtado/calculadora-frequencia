import { cp, mkdir } from 'node:fs/promises'

await mkdir('src/css', { recursive: true })
await mkdir('src/js', { recursive: true })

await cp(
  'node_modules/bootstrap/dist/css/bootstrap.min.css',
  'src/css/bootstrap.min.css'
)
await cp(
  'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
  'src/js/bootstrap.bundle.min.js'
)
