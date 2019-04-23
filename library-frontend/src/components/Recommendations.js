import React, { useEffect, useState } from 'react'
import { useApolloClient } from 'react-apollo-hooks'
import { GENRE } from '../Queries'
import { BOOKS_BY_GENRE } from '../Queries'

const Recommendations = ({data, show }) => {
  if (!show) {
    return null
  } else if (data.loading){
    return <div>loading...</div>
  }

  const [genre, setGenre] = useState('loading...')
  const [books, setBooks] = useState([])

  const client = useApolloClient()

  useEffect(() => {
    setGenres()
  }, [data])

  const setGenres = async () => {
    const g = await client.query({
      query: GENRE
    })
    setGenre(g.data.me.favoriteGenre)
    const bks = await client.query({
      query: BOOKS_BY_GENRE,
      variables: { genre: g.data.me.favoriteGenre}
    })
    setBooks(bks.data.allBooks)
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <b>{genre}</b>:</p>
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
    </div>
  )
}

export default Recommendations