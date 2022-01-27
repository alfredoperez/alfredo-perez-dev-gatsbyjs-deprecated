import newsletterFeed from './newsletterFeed'
import defaultOptions from './default-Options'
import algoliaQueries from './algoliaQueries'
import { GatsbyConfig } from 'gatsby'

const slugify = require('slugify')
require(`dotenv`).config({
  path: `.env`,
})
const { websiteData, siteMetadata } = defaultOptions

const gatsbyConfig: GatsbyConfig = {
  siteMetadata: {
    ...siteMetadata,
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-algolia',
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        chunkSize: 10000,
        queries: algoliaQueries,
        skipIndexing: process.env.ALGOLIA_SKIP_INDEX === 'true',
      },
    },
    {
      resolve: `gatsby-plugin-webpack-bundle-analyser-v2`,
      options: {
        analyzerMode: `server`,
        analyzerPort: `8888`,
        disable: process.env.ANALYSE_BUNDLE === 'true',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: websiteData.notesSourcePath,
        path: websiteData.notesSourcePath,
      },
    },
    {
      resolve: `gatsby-transformer-markdown-references`,
      options: {
        types: ['Mdx'],
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 960,
              quality: 90,
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: 'gatsby-remark-obsidian',
            options: {
              titleToURL: (title: any) =>
                `${websiteData.notesUrlPrefix}${slugify(title).toLocaleLowerCase()}`,
              markdownFolder: `${__dirname}/${websiteData.notesSourcePath}`,
              highlightClassName: 'highlight',
            },
          },
        ],
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 960,
              quality: 90,
              linkImagesToOriginal: false,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: newsletterFeed(`${siteMetadata.feedTitle}`),
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GOOGLE_ANALYTICS_ID,
      },
    },
    {
      resolve: 'gatsby-plugin-theme-ui',
      options: {
        prismPreset: 'night-owl',
      },
    },
    {
      resolve: `gatsby-plugin-postcss`,
      options: {
        postCssPlugins: [require(`tailwindcss`)({ stage: 0 })],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-tsconfig-paths`,
    `gatsby-plugin-gatsby-cloud`,
    `gatsby-plugin-sitemap`,
  ],
}

export default gatsbyConfig
