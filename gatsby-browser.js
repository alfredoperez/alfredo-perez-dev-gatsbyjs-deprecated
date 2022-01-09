// eslint-disable-next-line no-unused-vars
import React from 'react'
// eslint-disable-next-line import/no-unresolved
import { Layout } from './src/components_deprecated/Layout'
// eslint-disable-next-line import/no-unresolved
import './src/styles/globals.css'

export function wrapPageElement({ element, props }) {
  return <Layout {...props}>{element}</Layout>
}
