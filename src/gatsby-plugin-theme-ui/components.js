/* eslint react/prop-types: 0 */
import React from 'react'
import { Text } from '@theme-ui/components'
import { preToCodeBlock } from 'mdx-utils'

import Code from '../components/Code'

const components = {
  // eslint-disable-next-line react/display-name
  Text: ({ children, ...props }) => <Text {...props}>{children}</Text>,
  // eslint-disable-next-line react/display-name
  pre: (preProps) => {
    const props = preToCodeBlock(preProps)
    console.log('HERE')
    // if there's a codeString and some props, we passed the test
    if (props) {
      return <Code {...props} />
    }
    // it's possible to have a pre without a code in it
    return <pre {...preProps} />
  },
  // eslint-disable - next - line react / display - name
  wrapper: ({ children }) => <>{children}</>,
}

export default components
