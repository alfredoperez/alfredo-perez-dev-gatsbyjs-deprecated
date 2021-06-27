import React, { PropsWithChildren } from 'react'
import { IconButton, Heading, Flex } from 'theme-ui'
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
} from 'react-share'
import attachSocialIcons from '@utils/attachSocialIcons'

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

interface PostShareProps extends PropsWithChildren<any> {
  location: any
  title: string
}

const PostShare = ({ location, title }: PostShareProps) => {
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
