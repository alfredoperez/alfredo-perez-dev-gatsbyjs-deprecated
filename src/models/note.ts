export interface TagEntity {
  name: string
  slug: string
}

export interface BannerImage {
  childImageSharp: {
    resize: {
      src: string
    }
  }
}

export interface Note {
  id: string
  slug: string
  title: string
  created: string
  updated: string
  description: string
  status: string
  body: string
  excerpt: string
  tags?: Array<TagEntity>
  canonicalUrl?: string
  timeToRead?: number
  banner?: BannerImage
}
