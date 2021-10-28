export default {
  spinner: {
    display: `block`,
    margin: `auto`,
  },
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
  },
  hitGroup: {
    '+ div': {
      borderTopStyle: `solid`,
      borderTopColor: `omegaLight`,
      borderTopWidth: 1,
      pt: 3,
    },
  },
}
