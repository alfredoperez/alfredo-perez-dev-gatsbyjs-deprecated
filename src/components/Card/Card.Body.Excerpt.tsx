import React from 'react'
import { get, Text, useThemeUI } from 'theme-ui'
import { buildResponsiveVariant as rv } from '../../utils'

const styles = {
  excerpt: {
    flex: `auto`,
    mb: 3,
  },
}

const CardBodyExcerpt = ({ variant, excerpt, omitExcerpt }) => {
  const context = useThemeUI()

  const responsiveVariant = rv(variant, `excerpt`)

  const themeValue = get(context.theme, responsiveVariant, {})
  const visibility = themeValue.display === `none`
  return !omitExcerpt && visibility ? (
    <Text
      variant="small"
      sx={{
        ...styles.excerpt,
        variant: responsiveVariant,
      }}
    >
      {excerpt}
    </Text>
  ) : null
}

export default CardBodyExcerpt
