import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {schema} from './data/schema';

//if you don't have below line, nodemon won't re-load generateSchemaJson, 
//and as such your old schema.json is used
import './scripts/updateSchema'


const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;
// Expose a GraphQL endpoint
const graphQLServer = express();
graphQLServer.use('/', graphQLHTTP({schema, graphiql: true, pretty: true}));
//access http://localhost:8080/graphql to see graphiQL UI

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

