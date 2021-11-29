import {
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaFacebook,
  FaEnvelope,
  FaLink,
  FaGlobe,
} from 'react-icons/fa'
import { extractHostname } from './extractHostName'

const icons = {
  default: {
    Icon: FaLink,
    color: `#718096`,
  },
  github: {
    Icon: FaGithub,
    color: `darkslategray`,
  },
  twitter: {
    Icon: FaTwitter,
    color: `#1DA1F2`,
  },
  instagram: {
    Icon: FaInstagram,
    color: `#C13584`,
  },
  linkedin: {
    Icon: FaLinkedinIn,
    color: `#2867B2`,
  },
  facebook: {
    Icon: FaFacebook,
    color: `#4267B2`,
  },
  email: {
    Icon: FaEnvelope,
    color: `#718096`,
  },
  website: {
    Icon: FaGlobe,
    color: `darkslategray`,
  },
}

export const attachSocialIcons = (items: Array<{ name: string; url: string }>) =>
  items.length &&
  items.map((item) => {
    const name = (item.name || extractHostname(item.url || item)).toLowerCase()
    return {
      name,
      url: item.url || item,
      ...((icons as any)[name] || icons.default),
    }
  })
