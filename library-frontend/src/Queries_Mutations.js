import { gql } from 'apollo-boost'

const ALL_BOOKS = gql`
{
  allBooks {
    title
    author
    published
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

const CREATE_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: String!, $genres: [String!]!){
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ){
    title
    author
  }
}
`
const CHANGE_BORN = gql`
mutation changeBorn($name: String!, $brn: Int!){
  editAuthor(name: $name, born: $brn){
    name
    born
  }
}
`

export {ALL_BOOKS, ALL_AUTHORS, CREATE_BOOK, CHANGE_BORN}