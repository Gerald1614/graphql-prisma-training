import express from 'express';
import http from 'http'
import ApolloServer from './utils/ASE.js'
import PubSub from './utils/AS.js'
import { typeDefs } from './schema'
import db from './db.mjs'
import { Query } from './resolvers/Query'
import { Mutation } from './resolvers/Mutation'
import { Subscription } from './resolvers/Subscription.mjs'
import { User } from './resolvers/User'
import { Post } from './resolvers/Post'
import { Comment } from './resolvers/Comment'
import prisma  from './utils/prismaImport'


const PORT = 8000;
const app = express();

const pubsub = new PubSub()
const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
  },
  context: req => ({
    prisma,
    db,
    pubsub
  })
});

server.applyMiddleware({ app, path: '/graphql' });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer)

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
})