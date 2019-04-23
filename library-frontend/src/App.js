import React, { useState } from 'react'
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'
import { gql } from 'apollo-boost'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/Login'
import {ALL_AUTHORS, ALL_BOOKS} from './Queries'
import {CREATE_BOOK, CHANGE_BORN} from './Mutations'

const App = (props) => {

  const client = useApolloClient()

  const LOGIN = gql`
    mutation login($username: String!, $password: String!){
      login(username: $username, password: $password){
        value
      }
    }
  `

  const handleError = (error) => {
    console.log('error: ', error.graphQLErrors[0].message)
    setMessage('Error: Wrong credentials')
    setMsgColor('red')
    setTimeout(() => {
      setMessage('')
      setMsgColor('green')
    }, 3000);
  }

  const [token, setToken] = useState(null)
  const [message, setMessage] = useState('')
  const [mgsColor, setMsgColor] = useState('green')
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

  const login = useMutation(LOGIN)


  const handleMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => {
      setMessage('')
    }, 3000);
  }

  const logOut = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    const msg = 'User logged out'
    handleMessage(msg)
  }

  const ErrorNotification = () => {
    if (message === ''){
      return <div></div>
    }
    return <div style={{ color: mgsColor}}>{message}</div>
  }

  if (!token){
    return (
<div>
      <ErrorNotification/>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('login')}>login</button>
      </div>
          <Authors show={page === 'authors'} data={authors} changeBorn={changeBorn}/>
          <Books show={page === 'books'} data={books}/>
          <LoginForm 
            show={page === 'login'} 
            login={login} setToken={(token) => setToken(token)} 
            handleError={handleError} 
            handleMessage={handleMessage}
            setPage={setPage}
          />
      </div>
    )
  }

  return (
    <div>
      <ErrorNotification/>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={logOut}>logout</button>
      </div>
          <Authors show={page === 'authors'} data={authors} changeBorn={changeBorn}/>
          <Books show={page === 'books'} data={books}/>
          <NewBook show={page === 'add'} addBook={addBook} handleMessage={handleMessage}/>
      </div>
  )
}

export default App
