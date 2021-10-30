/** @jsx jsx */
import React from 'react'
import { IconButton, Heading, Flex, jsx } from 'theme-ui'
import { TwitterShareButton, LinkedinShareButton } from 'react-share'
import { attachSocialIcons } from '../../utils'

const styles = {
  wrapper: {
    alignItems: `center`,
    height: `20px`,
  },
  heading: {
    color: `omegaDark`,
    mr: 1,
    mb: 0,
  },
}

type PostShareProps = {
  location: any
  title: string
}

const PostShare: React.FC<PostShareProps> = ({ location, title }: PostShareProps) => {
  const url = location?.href

  const Twitter = ({ children }: any) => (
    <TwitterShareButton url={url} title={title}>
      {children}
    </TwitterShareButton>
  )

  const Linkedin = ({ children }: any) => (
    <LinkedinShareButton url={url} quote={title}>
      {children}
    </LinkedinShareButton>
  )

  const buttons = {
    // facebook: Facebook,
    twitter: Twitter,
    linkedin: Linkedin,
    //   email: Email,
  }

  const buttonsWithIcons = attachSocialIcons(Object.keys(buttons).map((s) => ({ name: s })))

  return (
    <Flex sx={styles.wrapper}>
      <Heading variant="h5" sx={styles.heading}>
        Share
      </Heading>
      {buttonsWithIcons.map(({ name, color, Icon }) => {
        const ShareButton = buttons[name]
        const buttonStyle = {
          ...color,
          width: `20px`,
          height: `20px`,
        }
        return (
          ShareButton && (
            <IconButton as="span" variant="simple" key={`share-${name}`} sx={{ color }}>
              <ShareButton>
                <Icon />
              </ShareButton>
            </IconButton>
          )
        )
      })}
    </Flex>
  )
}

export default PostShare
