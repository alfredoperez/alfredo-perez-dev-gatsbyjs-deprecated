// eslint-disable-next-line no-unused-vars
import React from 'react'
import Layout from './src/components/layout'

require('typeface-ibm-plex-sans')

export function wrapPageElement({ element, props }) {
  return <Layout {...props}>{element}</Layout>
}