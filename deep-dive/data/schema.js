import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql'

import nodeInterface from './nodeInterface'
let counter = 10

export class Person { }

//******************************************************************** */
// the nodeInterface is not an interfaces, but an instance of GraphQLInterfaceType
// it does two things:
// 1. specify what fields the implementation class (which is an GraphQLObjectType) must implementation
// 2. it (optionally) tells graphql what object can be converted to the graphqlObjectType
const PersonType = new GraphQLObjectType({
    name: 'Person',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID),
            description: `can't use GraphQLInt...`
        },
        name: {
            type: GraphQLString,
            resolve: (obj) => `${obj.first_name} ${obj.last_name}`
        },
        age: {
            type: GraphQLInt
        }
    }),
    //GraphQLInterfaceType default to graphqlObjectType::isTypeOf to tell where an object can be converted to graphqlObjectType
    //isTypeOf?: GraphQLIsTypeOfFn<TSource, TContext>;
    interfaces: [nodeInterface]
})
//******************************************************************** */
const StoreType = new GraphQLObjectType({
    name: 'Store',
    description: '...',

    fields: () => ({
        counter: {
            type: GraphQLInt,
            resolve: () => counter
        },
        person: {
            type: PersonType,
            resolve: (root, args) =>
                new Promise((resolve, resject) => {
                    setTimeout(function () {
                        const person = new Person();
                        person.id = 1;
                        person.first_name = 'bo';
                        person.last_name = 'chen';
                        person.age = 34;
                        person.friends = [2, 3, 4];
                        resolve(person);
                    }, 500); 
                })
        }
    }
    )
}
)

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: () => ({
            store: {
                type: StoreType,
                resolve: () => ({})
            }
        })
    }),

    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: () => ({
            incrementCounter: {
                type: GraphQLInt,
                resolve: () => ++counter
            },
            message: {
                type: GraphQLString,
                resolve: () => 'hello,world!'
            }
        })
    })
})

export default schema
export {
    PersonType
}