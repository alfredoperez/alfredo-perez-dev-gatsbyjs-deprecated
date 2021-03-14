const newsletterFeed = require(`./src/utils/newsletterFeed`)
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

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
      resolve: `gatsby-plugin-styled-components`,
      options: {
        // Add any options here
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: options.notesPath,
        path: options.notesPath,
      },
    },
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
        trackingId: 'UA-76775958-2',
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-theme-ui`,
    `gatsby-plugin-gatsby-cloud`,
  ].filter(Boolean),
}
