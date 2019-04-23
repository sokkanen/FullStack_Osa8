import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import { GENRE } from '../Queries'

const Recommendations = ({data, show }) => {
  if (!show) {
    return null
  } else if (data.loading){
    return <div>loading...</div>
  }

  let genre = useQuery(GENRE).data.me
  genre = genre ? genre.favoriteGenre : 'loading...'

  const books = data.data.allBooks.filter(b => b.genres.includes(genre))

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