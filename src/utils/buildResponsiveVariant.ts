/**
 * Builds theme-ui variant dynamically
 */
import { castArray } from './castArray'

export const buildResponsiveVariant = (a: unknown, b: unknown, c?: unknown): string =>
  `${a}.${b}${c ? `.${c}` : ``}`
// export const buildResponsiveVariant = (
//   a: Array<string> | string,
//   b: Array<string> | string,
//   c?: Array<string> | string,
// ): Array<string> => {
//   // Responsive variant is passed
//   // Add variant child(b) to variant only
//   if (Array.isArray(a)) {
//     return a.map((variant) => [variant, b].join(`.`))
//   }
//
//   // Variant group is passed
//   return castArray(b).map((variant) => {
//     const variants = [a, variant]
//
//     if (c) {
//       variants.push(c)
//     }
//
//     return variants.join(`.`)
//   })
// }
