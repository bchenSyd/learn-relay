import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';

import schema from './mockSchema';

const GRAPHQL_PORT = 8000
// Expose a GraphQL endpoint
const graphQLServer = express();
graphQLServer.use('/', graphQLHTTP({ schema, graphiql: true, pretty: true }));

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
    `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

