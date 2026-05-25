/// <reference types="node" />
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const TOKENS_CSS = fs.readFileSync(
  path.resolve(HERE, '../styles/tokens.css'),
  'utf8',
)

describe('Bloom @property registrations', () => {
  for (const name of ['--bloom-dark', '--bloom', '--bloom-bright']) {
    it(`registers ${name} as <color> with transparent initial-value`, () => {
      const block = new RegExp(
        `@property\\s+${name}\\s*\\{[^}]*syntax:\\s*['"]<color>['"];[^}]*inherits:\\s*true;[^}]*initial-value:\\s*transparent`,
        's',
      )
      expect(TOKENS_CSS).toMatch(block)
    })
  }
})
