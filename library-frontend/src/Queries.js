import { gql } from 'apollo-boost'

const ALL_BOOKS = gql`
{
  allBooks {
    title
    author {
      name
      born
      bookCount
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

const BOOKS_BY_GENRE = gql`
query booksByGenre($genre: String!){
  allBooks(genre: $genre){
    title
    author {
      name
      born
      bookCount
    }
    published
    genres
  }        
}
`

export {ALL_BOOKS, ALL_AUTHORS, GENRE, BOOKS_BY_GENRE}