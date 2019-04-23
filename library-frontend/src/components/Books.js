import React, { useState } from 'react'
import { useApolloClient } from 'react-apollo-hooks'
import { BOOKS_BY_GENRE, ALL_BOOKS } from '../Queries'

const Books = ({data, show}) => {
  if (!show) {
    return null
  } else if (data.loading){
    return <div>loading...</div>
  }

  const [books, setBooks] = useState(data.data.allBooks)
  const [genres, setGenres] = useState([])

  const client = useApolloClient()

  books.forEach(book => {
    book.genres.forEach(g => {
      if (!genres.includes(g)){
        setGenres(genres.concat(g))
      }
    })
  });

  const genresBooks = async (genre) => {
    if (genre === ''){
      setBooks(data.data.allBooks)
      return
    }
    const bks = await client.query({
      query: BOOKS_BY_GENRE,
      variables: { genre: genre},
      update: (store, response) => {
        const data = store.readQuery({ query: ALL_BOOKS })
        data.allBooks.push(response.data.bks)
        store.writeQuery({
          query: ALL_BOOKS,
          data: data
        })
      }
    })
    setBooks(bks.data.allBooks)
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      {genres.map(g => <button key={g} onClick={() => genresBooks(g)}>{g}</button>)}
      <button key={'all'} onClick={() => genresBooks('')}>All genres</button>
    </div>
  )
}

export default Books