import React, { useState } from 'react'

const Books = ({data, show}) => {
  if (!show) {
    return null
  } else if (data.loading){
    return <div>loading...</div>
  }

  const [books, setBooks] = useState(data.data.allBooks)
  const [genres, setGenres] = useState([])

  books.forEach(book => {
    book.genres.forEach(g => {
      if (!genres.includes(g)){
        setGenres(genres.concat(g))
      }
    })
  });

  const bookFilter = (g) => () => { 
    if (g === ''){
      setBooks(data.data.allBooks)
    } else {
      setBooks(data.data.allBooks.filter(b => b.genres.includes(g)))
    }
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
      {genres.map(g => <button key={g} onClick={bookFilter(g)}>{g}</button>)}
      <button key={'all'} onClick={bookFilter('')}>All genres</button>
    </div>
  )
}

export default Books