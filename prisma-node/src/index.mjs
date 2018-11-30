import express from 'express';
import http from 'http'
import ApolloServer from './utils/ASE.js'
import PubSub from './utils/AS.js'
import { typeDefs } from './schema'
import db from './db.mjs'
import {resolvers} from './resolvers/index'
import prisma  from './utils/prismaImport'


const PORT = 8000;
const app = express();

const pubsub = new PubSub()
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => {
    return {
      prisma,
      db,
      pubsub,
      req
    }
  }
});

server.applyMiddleware({ app, path: '/graphql' });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer)

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
})