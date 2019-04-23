import { gql } from 'apollo-boost'

const ALL_BOOKS = gql`
{
  allBooks {
    title
    author {
      name
      born
    }
    published
    genres
  }
}
`

const ALL_AUTHORS = gql`
{
  allAuthors {
    name
    born
    bookCount
  }
}
`

const GENRE = gql`
{
  me {
    favoriteGenre
  }
}
`

export {ALL_BOOKS, ALL_AUTHORS, GENRE}