import React from 'react'
import styled from 'styled-components'

type StatusProps = {
  status: string
}

const StatusIcon = styled.p`
  margin: 0;
`

const Status = ({ status }: StatusProps) => {
  switch (status) {
    case 'evergreen':
      return <StatusIcon>🌳</StatusIcon>
    case 'seed':
      return <StatusIcon>🌱</StatusIcon>
    case 'bud':
      return <StatusIcon>🌿</StatusIcon>
    case 'snag':
      return <StatusIcon>🍂</StatusIcon>
    default:
      return null
  }
}

export default Status
