export default {
  // form: ({ focus }) => ({
  //   display: [focus ? `flex` : `none`, focus ? `flex` : `none`, `flex`],
  //   alignItems: `center`,
  //   bg: `omegaLight`,
  //   borderRadius: `default`,
  //   position: focus ? `absolute` : `static`,
  //   top: 4,
  //   left: `50%`,
  //   transform: focus ? `translate(-50%, 0)` : `translate(0, 0)`,
  //   zIndex: 99,
  //   width: focus ? `80vw` : `auto`,
  //   maxWidth: focus ? `40em` : `none`,
  //   borderStyle: `solid`,
  //   borderColor: focus ? `omegaLight` : `headerBg`,
  //   borderWidth: `md`,
  //   px: 3,
  // }),
  // searchIcon: {
  //   flexShrink: 0,
  //   height: `20px`,
  //   width: `20px`,
  // },
  // searchIconFa: {
  //   height: `20px`,
  //   width: `20px`,
  // },
  // mobileTrigger: {
  //   display: [`block`, `block`, `none`],
  //   height: `20px`,
  //   width: `20px`,
  // },
  // input: {
  //   ml: 1,
  // },
  // poweredBy: {
  //   position: [`fixed`, `static`],
  //   right: 0,
  //   top: `-100%`,
  //   transform: [`translateY(50%)`, `none`],
  //   textAlign: `right`,
  //   fontWeight: `medium`,
  //   fontSize: 1,
  //   width: 200,
  //   svg: {
  //     width: 60,
  //     height: 16,
  //     verticalAlign: `middle`,
  //   },
  // },
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
