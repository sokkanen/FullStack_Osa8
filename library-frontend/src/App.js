import React, { useState } from 'react'
import { useQuery, useMutation, useApolloClient } from 'react-apollo-hooks'
import { gql } from 'apollo-boost'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/Login'
import Recommendations from './components/Recommendations'
import {ALL_AUTHORS, ALL_BOOKS} from './Queries'
import {CREATE_BOOK, CHANGE_BORN} from './Mutations'
import { Subscription } from 'react-apollo'
import { DataStore } from 'apollo-client/data/store';

const App = () => {

  const client = useApolloClient()

  const LOGIN = gql`
    mutation login($username: String!, $password: String!){
      login(username: $username, password: $password){
        value
      }
    }
  `

  const BOOK_ADDED = gql`
    subscription {
      bookAdded {
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
    refetchQueries: [{query: ALL_BOOKS}, {query: ALL_AUTHORS}],
    update: (store, response) => {
      const booksInStore = store.readQuery({ query: ALL_BOOKS })
      const addedBook = response.data.addBook
      const found = booksInStore.allBooks.map(b => b.id).includes(addedBook.id)
      if (!found){
        booksInStore.allBooks.push(addedBook)
        client.writeQuery({
          query: ALL_BOOKS,
          data: booksInStore
        })
      } 
    }
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
      <div>
        <Subscription
          subscription={BOOK_ADDED}
          onSubscriptionData={({subscriptionData}) => {
            window.alert(`A new book '${subscriptionData.data.bookAdded.title}' by '${subscriptionData.data.bookAdded.author.name}' has been added!`)
            const authorsInStore = client.readQuery({ query: ALL_AUTHORS })
            const addedBookAuthor = subscriptionData.data.bookAdded.author
            const authorFound = authorsInStore.allAuthors.map(a => (a.name)).includes(addedBookAuthor.name)
            if (!authorFound){
              authorsInStore.allAuthors.push(addedBookAuthor)
              client.writeQuery({
                query: ALL_AUTHORS,
                data: authorsInStore
              })
            }
            const booksInStore = client.readQuery({ query: ALL_BOOKS })
            const addedBook = subscriptionData.data.bookAdded
            const found = booksInStore.allBooks.map(b => (b.title)).includes(addedBook.title)
            if (!found){
              booksInStore.allBooks.push(addedBook)
              client.writeQuery({
                query: ALL_BOOKS,
                data: booksInStore
              })
            }
          }}>
            {() => null}
        </Subscription>
      </div>
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
        <button onClick={() => setPage('recommendations')}>recommendations</button>
        <button onClick={logOut}>logout</button>
      </div>
          <Authors show={page === 'authors'} data={authors} changeBorn={changeBorn}/>
          <Books show={page === 'books'} data={books}/>
          <NewBook show={page === 'add'} addBook={addBook} handleMessage={handleMessage}/>
          <Recommendations show={page === 'recommendations'} data={books}/>
      </div>
  )
}

export default App
