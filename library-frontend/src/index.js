import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { ApolloProvider } from 'react-apollo-hooks'

const link = createHttpLink({
    uri: 'http://localhost:4000/graphql'
})

const linkWithToken = setContext((_, { headers }) => {
    const token = localStorage.getItem('user-token')
    return {
        headers: {
            ...headers,
            authorization: token ? `bearer ${token}` : null
        }
    }
})

const client = new ApolloClient({
    link: linkWithToken.concat(link),
    cache: new InMemoryCache()
})

ReactDOM.render(
<ApolloProvider client={client}>
        <App />
</ApolloProvider>,
document.getElementById('root'))