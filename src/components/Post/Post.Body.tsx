import React from 'react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { MDXProvider } from '@theme-ui/mdx'
import components from '@components/Mdx'

export const PostBody = ({ body }: any) => <MDXRenderer>{body}</MDXRenderer>
