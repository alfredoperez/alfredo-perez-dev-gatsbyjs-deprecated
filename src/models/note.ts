export interface Tag {
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

export interface ParentNote {
  inboundReferences: Array<NoteReference>
  outboundReferences: Array<NoteReference>
}

export interface ChildMdxNote {
  title: string
  id: string
  slug: string
}

export interface NoteReference {
  childMdxNote: ChildMdxNote
}

export interface SlimNote {
  title: string
  id: string
  slug: string
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
  tags?: Array<Tag>
  canonicalUrl?: string
  timeToRead?: number
  banner?: BannerImage
  parent: ParentNote
}
