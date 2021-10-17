const newsletterFeed = require(`./utils/newsletterFeed`)
require(`dotenv`).config({
  path: `.env`,
})

const options = require(`./utils/default-options`)

const siteMetadata = {
  siteTitle: 'Alfredo Perez',
  siteTitleAlt: `Alfredo Perez - Digital Garden`,
  feedTitle: 'Alfredo Perez - Digital Garden',
  siteHeadline: `This is a beautiful digital garden`,
  siteUrl: `https://alfredo-perez.dev`,
  siteDescription: `Digital garden where ideas can flourish`,
  siteLanguage: `en`,
  siteImage: `/logo.png`,
  author: `@alfredo-perez`,
}

module.exports = {
  siteMetadata,
  plugins: [
    {
      resolve: 'gatsby-plugin-algolia',
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        chunkSize: 10000,
        queries: require('./utils/algolia-queries'),
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
        name: options.notesPath,
        path: options.notesPath,
      },
    },

    // Link references
    {
      resolve: `gatsby-transformer-markdown-references`,
      options: {
        types: ['Mdx'], // or ['RemarkMarkdown'] (or both)
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
            resolve: 'gatsby-remark-double-brackets-link',
            options: {
              titleToURLPath: `${__dirname}/utils/resolve-url.js`,
              stripBrackets: true,
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
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-gatsby-cloud`,
    `gatsby-plugin-tsconfig-paths`,
    `gatsby-plugin-sitemap`,
  ].filter(Boolean),
}
