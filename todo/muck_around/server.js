import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import schema from './data/schema'

//*****************************************************************************************/

//if you don't have below line, nodemon won't re-load generateSchemaJson, and as such
//you old schema.json is used
import './script/generateSchemaJson'
//*****************************************************************************************/
const GRAPHQL_PORT = 8002
// Expose a GraphQL endpoint
const graphQLServer = express();
graphQLServer.use('/', graphQLHTTP({ schema, graphiql: true, pretty: true }));

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
    `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));


