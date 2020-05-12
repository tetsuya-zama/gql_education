const {ApolloServer} = require('apollo-server');
const {typeDefs} = require('./schema');//スキーマ
const {createDataSources, resolvers} = require('./resolver');//リゾルバ

//作成したスキーマ、リゾルバを指定してサーバの作成
const server = new ApolloServer({typeDefs, resolvers, dataSources:createDataSources});

//サーバの起動
server.listen().then(({url}) => console.log(`server listen at ${url}`));
