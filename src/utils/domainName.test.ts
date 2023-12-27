import { describe, expect, test } from 'vitest'
import { convertToDomain, convertToDomainString } from './domainName'

const domainData = [
  ['test.cel', { name: 'test', parent: 'cel' }],
  ['test', { name: 'test', parent: '' }],
  ['sub.test.cel', { name: 'sub', parent: 'test.cel' }],
  ['', { name: '', parent: '' }],
]

describe.each(domainData)('domainName', (x, y) => {
  test(`convertToDomain: ${x} -> ${JSON.stringify(y)}`, () => {
    expect(convertToDomain(x)).toStrictEqual(y)
  })
  test(`convertToDomainString: ${JSON.stringify(y)} -> ${x}`, () => {
    expect(convertToDomainString(y.name, y.parent)).toStrictEqual(x)
  })
})
