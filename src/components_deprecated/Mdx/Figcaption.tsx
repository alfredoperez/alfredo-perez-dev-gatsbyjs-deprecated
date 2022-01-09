import React, { PropsWithChildren } from 'react'
import { css } from 'theme-ui'

type FigcaptionProps = PropsWithChildren<{}>
const Figcaption = (props: FigcaptionProps) => (
  <figcaption {...props} css={css((t) => t.styles.figcaption)}>
    {props.children}
  </figcaption>
)

export default Figcaption
