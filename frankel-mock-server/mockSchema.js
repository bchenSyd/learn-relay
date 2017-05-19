import { addMockFunctionsToSchema, MockList } from 'graphql-tools';
import { graphql, buildClientSchema } from 'graphql';

import casual from 'casual';
import { eventResolver, raceResolver } from './resolvers';

// step 1: build schema
//*********************************************************************************
//option 1: build schema using graphql defination
// import schemaString from './data/schema.graphql';
// const schema = makeExecutableSchema({ typeDefs: schemaString});

//option 2: build schema using introspection
import * as introspectionResult from './data/schema.json';
const schema = buildClientSchema(introspectionResult.data);
//*********************************************************************************

// step 2: mock implementation
addMockFunctionsToSchema({
    schema,
    mocks: {
        Int: ()=> casual.integer(1,10),
        Viewer: () => ({
            events: () => new MockList([2, 6]),
            races: () => new MockList([12, 16])
        }),
        Event: (obj, args, context) => {
            let { id } = args;
            return eventResolver(id);
        },
        Race: (obj, args, context) => {
            return raceResolver();
        }
    }
})

// graphql(schema, query).then( result => {
//     console.log('result', result);
// })
export default schema;