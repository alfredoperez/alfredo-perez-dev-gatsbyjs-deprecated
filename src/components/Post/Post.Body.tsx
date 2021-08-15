import React from 'react'
import { MDXRenderer } from 'gatsby-plugin-mdx'

type PostBodyProps = { body: any }
export const PostBody = ({ body }: PostBodyProps) => <MDXRenderer>{body}</MDXRenderer>
