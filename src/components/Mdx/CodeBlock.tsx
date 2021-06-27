import React from 'react'
import { Styled } from 'theme-ui'

const CodeBlock = (props) => (
  // eslint-disable-next-line react/jsx-pascal-case
  <>
    <h1>HERE!</h1>
    <Styled.pre>{props.children}</Styled.pre>
  </>
)

export default CodeBlock
