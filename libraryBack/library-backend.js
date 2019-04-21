require('dotenv').config()
const { ApolloServer, gql, UserInputError } = require('apollo-server')
const uuid = require('uuid/v1')
const Author = require('./models/Author')
const Book = require('./models/Book')
const mongoose = require('mongoose')

const url = process.env.DB_URI
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
`

const resolvers = {

    Mutation: {
      addBook: async (root, args) => {
        const auth = await Author.findOne({ name: args.author })
        if (auth === null){
          try {
            const author = new Author({name: args.author})
            await author.save()
            const book = new Book({...args, author: author._id})
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
      editAuthor: async (root, args) => {
        try {
          const res = await Author.updateOne({ "name": args.name },{ $set: { "born": args.born }})
          if (res.nModified === 0){
            return null
          }
          return Author.findOne({ name: args.name })
        } catch (error) {
          throw new UserInputError(error.message, {invalidArgs: args})
        }
      }
    },

    Query: {
      bookCount: async (root, args) => {
          if (!args.name){
              return Book.collection.countDocuments()
          }
          const auth = await Author.findOne({ name: args.name})
          return Book.collection.countDocuments({ author: auth._id})
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
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})