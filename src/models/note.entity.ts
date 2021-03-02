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

export interface NoteEntity {
  slug: string
  title: string
  date: string
  description: string
  body: string
  excerpt: string
  tags?: Array<TagEntity>
  canonicalUrl?: string
  timeToRead?: number
  banner?: BannerImage
}
