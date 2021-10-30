import { buildResponsiveVariant } from './buildResponsiveVariant'

describe(`buildResponsiveVariant`, () => {
  it(`should build a responsive variant when a set of strings is passed`, () => {
    const responsiveVariant = buildResponsiveVariant(`card`, `paper-lg`)
    expect(responsiveVariant).toBe(`card.paper-lg`)
  })
})
