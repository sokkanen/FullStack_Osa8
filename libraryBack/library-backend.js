require('dotenv').config()
const { ApolloServer, gql, UserInputError, AuthenticationError, PubSub } = require('apollo-server')
const Author = require('./models/Author')
const Book = require('./models/Book')
const User = require('./models/User')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const url = process.env.DB_URI
const SECRET = process.env.SECRET
const pubsub = new PubSub()

mongoose.set('useFindAndModify', false)
mongoose.connect(url, { useNewUrlParser: true})
.then(() => {
  console.log('Connected to MLAB')
})
.catch((error) => {
  console.log('Error connecting to MLAB:', error.message)
})

const typeDefs = gql`
  type Query {
      bookCount(name: String): Int!
      authorCount: Int!
      allBooks(author: String, genre: String): [Book!]!
      allAuthors: [Author!]!
      me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      born: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }

  type Book {
      title: String!
      author: Author!
      published: Int!
      genres: [String!]!
      id: ID!
  }

  type Author {
      name: String!
      born: Int
      bookCount: Int!
      id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

`

const resolvers = {

    Mutation: {
      addBook: async (root, args, context) => {
        if (!context.currentUser){
          throw new AuthenticationError('Not authenticated')
        }
        const auth = await Author.findOne({ name: args.author })
        if (auth === null){
          try {
            const author = new Author({name: args.author})
            await author.save()
            const book = new Book({...args, author: author._id})
            pubsub.publish('BOOK_ADDED', { bookAdded: book })
            return book.save()
          } catch (error) {
            throw new UserInputError(error.message, {invalidArgs: args})
          }
        }
        try {
          const book = new Book({...args, author: auth._id})
          return book.save()
        } catch (error) {
          console.log('Problem saving new book', error.message)
        }
      },
      editAuthor: async (root, args, context) => {
        if (!context.currentUser){
          throw new AuthenticationError('Not authenticated')
        }
        try {
          const res = await Author.updateOne({ "name": args.name },{ $set: { "born": args.born }})
          if (res.nModified === 0){
            return null
          }
          return Author.findOne({ name: args.name })
        } catch (error) {
          throw new UserInputError(error.message, {invalidArgs: args})
        }
      },
      createUser: (root, args) => {
        const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre})
        return user.save()
        .catch((error) => {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
        if ( !user || args.password !== 'salainen'){
          throw new UserInputError('Wrong credentials')
        }

        const userForToken = {username: user.username, id: user._id}
        return { value: jwt.sign(userForToken, SECRET)}
      }
    },

    Subscription: {
      bookAdded: {
        subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
      }
    },

    Query: {
      bookCount: async (root, args) => {
          if (!args.name){
              return Book.collection.countDocuments()
          }
          const auth = await Author.findOne({ name: args.name })
          return Book.collection.countDocuments({ author: auth._id })
        },
      authorCount: () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
        if (!args.author && !args.genre){
            return Book.find({})
        } else if (args.genre && !args.author){
            return Book.find( { genres: { $in: [ args.genre ] } } )
        } else if (!args.genre && args.author){
          const auth = await Author.findOne({ name: args.author })
          return Book.find({ author: auth._id })
        }
        const auth = await Author.findOne({ name: args.author })
        return Book.find( { genres: { $in: [ args.genre ] }, author: auth._id } )
        },
      allAuthors: (root, args) => {
        return Author.find({})
      },
      me: (root, args, context) => {
        return context.currentUser
      }
    },

    Author: {
      bookCount: async (root) => {
        const books = await Book.find({ author: root })
        return books.length
      },
      name: async (root) => {
        const author = await Author.findOne({ _id: root })
        return author.name
      },
      born: async (root) => {
        const author = await Author.findOne({ _id: root })
        return author.born
      } 
    }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')){
      const decodedToken = jwt.verify(auth.substring(7), SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions available at ${subscriptionsUrl}`)
})