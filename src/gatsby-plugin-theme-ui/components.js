/* eslint react/prop-types: 0 */
import React from 'react'
import { Text } from '@theme-ui/components'
import { preToCodeBlock } from 'mdx-utils'

import Code from '../components_deprecated/Code'

const components = {
  // eslint-disable-next-line react/display-name
  Text: ({ children, ...props }) => <Text {...props}>{children}</Text>,
  // eslint-disable-next-line react/display-name
  pre: (preProps) => {
    const props = preToCodeBlock(preProps)
    // if there's a codeString and some props, we passed the test
    if (props) {
      return <Code {...props} />
    }
    // it's possible to have a pre without a code in it
    return <pre {...preProps} />
  },
  // eslint-disable-next-line react/jsx-no-useless-fragment
  wrapper: ({ children }) => <React.Fragment>{children}</React.Fragment>,
}

export default components
