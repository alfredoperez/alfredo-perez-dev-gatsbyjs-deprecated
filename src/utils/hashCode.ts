export const hashCode = (target: string) => {
  let hash = 0
  let i,
   chr
  for (i = 0; i < target.length; i++) {
    chr = target.charCodeAt(i)
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + chr
    // eslint-disable-next-line no-bitwise
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}
