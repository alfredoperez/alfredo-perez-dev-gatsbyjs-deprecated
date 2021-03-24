import { graphql } from 'gatsby'
import TagsComponent from './TagsPage'

export default TagsComponent

export const query = graphql`
  query {
    allNote(sort: { fields: tags___name, order: DESC }) {
      group(field: tags___name) {
        fieldValue
        totalCount
      }
    }
  }
`
