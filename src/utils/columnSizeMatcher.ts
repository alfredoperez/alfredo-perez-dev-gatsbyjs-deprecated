// Responsive flex sizes based on theme-ui sizes (theme.sizes)
export const columnSizeMatcher = (
  columns: Array<1 | 2 | 3 | 4 | 5>,
): { flexBasis: Array<string> } | null => {
  if (!Array.isArray(columns) || columns.length <= 0) return null

  const sizes = {
    1: `full`,
    2: `1/2`,
    3: `1/3`,
    4: `1/4`,
    5: `1/5`,
  }
  return {
    flexBasis: [sizes[columns[0]], sizes[columns[1]], sizes[columns[2]], sizes[columns[3]]],
  }
}
