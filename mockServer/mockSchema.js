import { addMockFunctionsToSchema, MockList } from 'graphql-tools';
import { graphql, buildClientSchema } from 'graphql';

import casual from 'casual';
import { getEvent } from './sunrise';

// step 1: build schema
//*********************************************************************************
//option 1: build schema using graphql defination
// import schemaString from './data/schema.graphql';
// const schema = makeExecutableSchema({ typeDefs: schemaString});

//option 2: build schema using introspection
import * as introspectionResult from './data/schema.json';
const schema = buildClientSchema(introspectionResult);
//*********************************************************************************

// step 2: mock implementation
addMockFunctionsToSchema({
    schema,
    mocks: {
        events: () => {
            return new MockList([4, 6])
        },
        Event: (obj, args, context) => {
            let { id } = args;
            return getEvent(id || 115353);
        },
        Competitor:()=>({
            id: 9000000 + casual.integer(0,9999),
            name: casual.word,
            eventId: 999,
            eliminated: false
        })
    }
})

// graphql(schema, query).then( result => {
//     console.log('result', result);
// })
export default schema;