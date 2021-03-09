import { createGlobalStyle } from 'styled-components'
//import font from 'typeface-ibm-plex-sans'

require('typeface-ibm-plex-sans')

const Typography = createGlobalStyle`
  //html {
  //  font-size: 1rem;
  //}
  //body {
  //  font-size: 2rem;
  //}
  html {
  //  font-family: FrenchFries, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: var(--black);
  }
  p, li {
    letter-spacing: 0.5px;
  }
  h1,h2,h3,h4,h5,h6 {
    font-weight: normal;
    margin: 0;
  }
  a {
    color: var(--blue);
    text-decoration-color: var(--blue);
    /* Chrome renders this weird with this font, so we turn it off */
    text-decoration-skip-ink: none;
  }
  mark, .mark {
    background: var(--yellow);
    padding: 0 2px 2px 2px;
    margin: 0;
    display: inline;
    line-height: 1;
  }
  .center {
    text-align: center;
  }
  .tilt {
    transform: rotate(-2deg);
  }
`

export default Typography
