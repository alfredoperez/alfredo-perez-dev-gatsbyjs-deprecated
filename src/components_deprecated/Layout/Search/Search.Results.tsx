import React from 'react'
import groupArray from 'group-array'
import { connectStateResults, Highlight, Snippet } from 'react-instantsearch-dom'
import { Box, Heading, Spinner, ThemeUICSSObject } from 'theme-ui'
import Card from '../../Card'
import useScrollDisabler from '../../../hooks/useScrollDisabler'

const styles = {
  spinner: {
    display: `block`,
    margin: `auto`,
  } as ThemeUICSSObject,
  hitGroup: {
    '+ div': {
      borderTopStyle: `solid`,
      borderTopColor: `omegaLight`,
      borderTopWidth: 1,
      pt: 3,
    },
  } as ThemeUICSSObject,
  hitsWrapper: {
    display: `block`,
    overflowY: `scroll`,
    WebkitOverflowScrolling: `touch`,
    position: `absolute`,
    top: 4,
    right: `50%`,
    transform: `translateX(50%)`,
    zIndex: 99,
    width: `80vw`,
    maxWidth: `40em`,
    maxHeight: [`70vh`, `50vh`],
    boxShadow: `
		0 15px 35px 0 rgba(50,50,93,.1),
		0 5px 15px 0 rgba(0,0,0,.07)
		`,
    bg: `contentBg`,
    borderRadius: `default`,
    p: 4,
    mt: 5,
    mark: {
      fontWeight: `bold`,
      backgroundColor: `highlight`,
    },
  } as ThemeUICSSObject,
}

interface HitsProps {
  searchState: any
  searchResults: any
}

const Hits = ({ searchState, searchResults }: HitsProps) => {
  useScrollDisabler()
  // Waiting for search request to return results from server
  if (searchResults.query !== searchState.query) {
    return <Spinner strokeWidth={2} duration={700} sx={styles.spinner} />
  }

  if (!searchResults || !searchResults.query) {
    return `What are you looking for?`
  }

  if (searchResults && searchResults.nbHits < 1) {
    return `No results for '${searchResults.query}'`
  }
  const hitsByType = groupArray(searchResults.hits, `type`)
  const types = Object.keys(hitsByType)
  return types.map((name) => (
    <Box variant="lists.cards.fixed.search" sx={styles.hitGroup} key={`search-${name}`}>
      <Heading variant="h4">{name}</Heading>
      {hitsByType[name].map((hit: any) => {
        const node = {
          ...hit,
          key: hit.objectID,
          title: <Highlight hit={hit} tagName="mark" attribute="title" />,
          excerpt: <Snippet hit={hit} tagName="mark" attribute="excerpt" />,
        }
        return <Card variant="search" {...node} omitCategory omitFooter omitMedia />
      })}
    </Box>
  ))
}

const ConnectedHits = connectStateResults(Hits)

const Results = () => (
  <Box sx={styles.hitsWrapper}>
    <ConnectedHits />
  </Box>
)

export default Results
