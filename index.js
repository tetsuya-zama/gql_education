const {ApolloServer} = require('apollo-server');
const {typeDefs} = require('./schema');
const {createDataSources, resolvers} = require('./resolver');

const server = new ApolloServer({typeDefs, resolvers, dataSources:createDataSources});

server.listen().then(({url}) => console.log(`server listen at ${url}`));
