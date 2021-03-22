import { castArray } from './castArray'

//Builds theme-ui variant dynamically
export const buildResponsiveVariant = (a: unknown, b: unknown, c?: unknown) => {
  //Responsive variant is passed
  //Add variant child(b) to variant only
  if (Array.isArray(a)) {
    return a.map((variant) => [variant, b].join('.'))
  }

  //Variant group is passed
  return castArray(b).map((variant) => {
    const variants = [a, variant]

    if (c) {
      variants.push(c)
    }

    return variants.join('.')
  })
}
