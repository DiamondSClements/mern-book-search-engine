const express = require('express');
const { ApolloServer } = require('@apollo/server.js');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');


const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');



const app = express();
const PORT = process.env.PORT || 3001;


//Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  
});

const startApolloServer = async () => {
  await server.start();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/graphql', expressMiddleware(server, {
  context: authMiddleware
}));

}





// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}


db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

startApolloServer();