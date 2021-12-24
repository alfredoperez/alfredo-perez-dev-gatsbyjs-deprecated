---
title: Architect an Extensible Digital Garden with Next.js, Tailwind, and Nx
authors: []
status: seed
tags: ["digital-garden"]
type: course
created: 12/20/2021
updated:
---

 https://egghead.io/courses/architect-an-extensible-digital-garden-with-next-js-tailwind-and-nx-53f7628f
 
# Creating the application

## `getStaticProps`
`getStaticProps` runs at build time, which means that it also allows us at that point to read from the local file system, which is really powerful, and which is also what we will need later on.


## `getStaticPaths`

[Next.js Docs](https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation)

If we want to create a blog, we’ll want to load pages dynamically. So we cannot really give them a static name as we did with our About page ( `about.tsx`).

`nx generate [@nrwl/next](http://twitter.com/nrwl/next):page --name="[slug]" --style=none --directory=articles`