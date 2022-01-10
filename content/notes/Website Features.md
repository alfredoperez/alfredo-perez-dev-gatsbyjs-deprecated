---
title: Website Features
description:
tags: [digital-garden,GatsbyJS,obsidian]
type: note
status: seed
created: 3/04/21
updated: 3/8/21
---

Here I track all the goals and tool used for the PKM system (Obsidian) and Website(GatsbyJS).

# PKM system using Obsidian 

I use the original themes and create CSS snippets as needed

## Obsidian
Using Obsidian as the  PKM system and note editor. [[My Obsidian Setup]]


#  Digital Garden Website 

### Developer Tools:

- 🔥 [Gatsby 4.0](https://www.gatsbyjs.com/) 
-  🚀Automatic deployments  using  [Gatsby Cloud](https://www.gatsbyjs.com/products/cloud/)
- 🎨 Styling with [Tailwind CSS](https://tailwindcss.com/)
- 🎉 Type checking [TypeScript](https://www.typescriptlang.org/)
- 🛠 Code Formatter with [Prettier](https://prettier.io/)
-  🛠 Lint using [eslint-config-kentcdodds](*https://github.com/kentcdodds/eslint-config-kentcdodds*)
- [Jest](https://jestjs.io/) for unit/integration testing
- 
-   [ ] TODO: [Cypress](https://www.cypress.io/) for E2E testing

### Features
-  📈[Google Analytics ](https://analytics.google.com/analytics/web/)using [gatsby-plugin-google-analytics](https://www.npmjs.com/package/gatsby-plugin-google-analytics)
- 🔎 Search using [Algolia](https://www.algolia.com)
-  [gatsby-plugin-image](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/) for optimized image generation
- TODO: SEO
	-   using `gatsby-plugin-react-helmet`
    -   [Google gtag.js](https://developers.google.com/gtagjs/) support
    -   Sitemap generation
    -   General description tags
    -   [Google Structured Data](https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data)
    -   [OpenGraph Tags (Facebook/Google+/Pinterest)](https://ogp.me/)
    -   [Twitter Tags (Twitter Cards)](https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/markup)
- 🗒️Posts in MDX
    -   Code syntax highlighting using [HighlightJS](https://highlightjs.org/)
    -   TODO: Embed videos
    -   TODO: Embed iframes
-  Uses the [[How this works]] note as the About page
 -  Supports Obsidian double brackets links using the gatsby-remark-obsidian
	 -  TODO: Remove `gatsby-remark-double-brackets-link` and `gatsby-transformer-markdown-references`
- [ ]  TODO: Markdown custom components embed `mdx-embed` and `gatsby-plugin-mdx-embed`

- [x] SEO using `gatsby-plugin-react-helmet`

- [ ] TODO: Highlights and comments
	- [

[Link](https://tomcritchlow.com/2019/02/17/building-digital-garden/) 
![https://res.cloudinary.com/dagkspppt/image/upload/v1615228423/2021-03-08\_12-32-37\_kwglil.png](https://res.cloudinary.com/dagkspppt/image/upload/v1615228423/2021-03-08_12-32-37_kwglil.png)

# Other links

- [CSS Tweaks for Obsidian ](https://github.com/kmaasrud/awesome-obsidian#collapsing-sidebar)
- [Awesome knowledge management ](https://github.com/brettkromkamp/awesome-knowledge-management)
- [Maggie Appleton - Digital Gardeners ](https://github.com/MaggieAppleton/digital-gardeners)
- [Gatsby Digital Garden Theme b](https://github.com/mathieudutour/gatsby-digital-garden/)