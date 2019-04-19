import { gql } from 'apollo-boost'

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

export {CREATE_BOOK, CHANGE_BORN}