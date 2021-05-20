import React from 'react'
import loadable from '@loadable/component'
import { Styled } from 'theme-ui'

const CodeBlock = (props) => {
  console.log('Not HERE')

  return (
    // eslint-disable-next-line react/jsx-pascal-case
    <React.Fragment>
      <h1>HERE!</h1>
      <Styled.pre>{props.children}</Styled.pre>
    </React.Fragment>
  )
}

export default CodeBlock
