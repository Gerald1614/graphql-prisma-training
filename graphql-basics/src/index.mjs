import express from 'express'
import  graphqlHTTP from 'express-graphql'
// import { buildSchema } from 'graphql'
import buildSchema from './req';

const users = [{
  id: '128214214',  
  name: 'Toto',
  age: 47,
  email: 'gerald@eef.com'
},
{
  id: '12erger14214',  
  name: 'sarah',
  age: 23,
  email: 'gdvdfv@eef.com'
},
{
  id: 'asdv14214',  
  name: 'verwberb',
  age: 445,
  email: 'geraldsvadvsd@eef.com'
}]

const posts = [{
  id: '4214',  
  title: 'vivre a montreal',
  body: 'ergwergyveqr regfqervreq',
  published: false,
  author: '128214214'
},
{
  id: 'ewfvfbvewev4214',  
  title: 'mourir a montreal',
  body: 'ergwergveqr regfqersdvsadv vreq',
  published: true,
  author: '128214214'
},
{
  id: 'ewfv11evv4214',  
  title: 'asta la vista',
  body: 'ergwergvfbvwfwevdbvwfe eqr regfqervreq',
  published: false,
  author: '12erger14214'
}]

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  users(args) {
    if(!args.query) {
      return users
    }
    return users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase())
    })
  },
  posts(args) {
    if(!args.query) {
      return posts
    }
    return posts.filter((post) => {
      const includeTitle =  post.title.toLowerCase().includes(args.query.toLowerCase())
      const includeBody =  post.body.toLowerCase().includes(args.query.toLowerCase())
      return includeTitle || includeBody
    })
  },
  me() {
    return {
      id: '128214214',  
      name: 'Toto',
      age: 47,
      email: 'gerald@eef.com'
    } 
  }
}



var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
