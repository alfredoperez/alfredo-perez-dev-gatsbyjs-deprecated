/**
 * Replace double slashes // with one slash /
 * @description This prevents double slashes as users might add e.g. the basePath as "/blog" or "blog"
 * @param input
 * @return {string} - Sanitized string
 */
export const replaceSlashes = (input: string): string => {
  return input.replace(/\/\/+/g, `/`)
}
