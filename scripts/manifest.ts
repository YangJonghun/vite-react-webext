import { getManifest } from '../src/manifest'
import { r, log } from './utils'
import fs from 'fs-extra'

export async function writeManifest() {
  await fs.writeJSON(r('extension/manifest.json'), await getManifest(), {
    spaces: 2,
  })
  log('PRE', 'write manifest.json')
}

writeManifest()
