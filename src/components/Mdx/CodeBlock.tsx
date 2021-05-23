import React from 'react'
import { Styled } from 'theme-ui'

const CodeBlock = (props) => {
  return (
    // eslint-disable-next-line react/jsx-pascal-case
    <React.Fragment>
      <h1>HERE!</h1>
      <Styled.pre>{props.children}</Styled.pre>
    </React.Fragment>
  )
}

export default CodeBlock
