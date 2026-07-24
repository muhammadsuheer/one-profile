import { describe, it, expect } from 'vitest'
import type { Block } from '@/db/schema'
import type { BlockData } from '@/lib/blocks/schemas'
import { buildProfileJsonLd } from './jsonld'

function block(data: BlockData): Block {
  return {
    id: 'id',
    siteId: 'site',
    type: data.type,
    position: 1000,
    isVisible: true,
    visibleFrom: null,
    visibleUntil: null,
    data,
  }
}

describe('buildProfileJsonLd', () => {
  it('returns null when there is no profile name', () => {
    expect(buildProfileJsonLd([], 'https://x.com/a')).toBeNull()
    expect(
      buildProfileJsonLd([block({ type: 'profile', avatarUrl: '', name: '' })], 'https://x.com/a'),
    ).toBeNull()
  })

  it('builds a Person with sameAs from social links', () => {
    const blocks = [
      block({ type: 'profile', avatarUrl: 'https://img/a.jpg', name: 'Ava', tagline: 'Hi' }),
      block({
        type: 'socialRow',
        items: [
          { platform: 'instagram', url: 'https://instagram.com/ava' },
          { platform: 'x', url: 'https://x.com/ava' },
          { platform: 'email', url: 'mailto:a@b.com' }, // not http -> excluded
        ],
      }),
    ]
    const ld = buildProfileJsonLd(blocks, 'https://one.page/ava')
    expect(ld).toMatchObject({
      '@type': 'Person',
      name: 'Ava',
      url: 'https://one.page/ava',
      description: 'Hi',
      image: 'https://img/a.jpg',
      sameAs: ['https://instagram.com/ava', 'https://x.com/ava'],
    })
  })

  it('omits image when avatar is not a valid http url', () => {
    const ld = buildProfileJsonLd(
      [block({ type: 'profile', avatarUrl: '', name: 'Ava' })],
      'https://one.page/ava',
    )
    expect(ld).not.toHaveProperty('image')
    expect(ld).not.toHaveProperty('sameAs')
  })
})
