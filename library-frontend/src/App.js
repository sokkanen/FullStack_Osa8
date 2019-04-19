import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-apollo-hooks'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import {CREATE_BOOK, ALL_AUTHORS, ALL_BOOKS, CHANGE_BORN} from './Queries_Mutations'

const App = () => {

  const handleError = (error) => {
    console.log('error: ', error.graphQLErrors[0].message)
  }

  const [page, setPage] = useState('authors')
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const addBook = useMutation(CREATE_BOOK, {
    onError: handleError,
    refetchQueries: [{query: ALL_BOOKS}, {query: ALL_AUTHORS}]
  })
  const changeBorn = useMutation(CHANGE_BORN, {
    onError: handleError,
    refetchQueries: [{query: ALL_AUTHORS}]
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>
          <Authors show={page === 'authors'} data={authors} changeBorn={changeBorn}/>
          <Books show={page === 'books'} data={books}/>
          <NewBook show={page === 'add'} addBook={addBook}/>
      </div>
  )
}

export default App
