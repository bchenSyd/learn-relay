import {
    GraphQLSchema,
    GraphQLInputObjectType,
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
export class Store { }

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
            description: `must be ID! to be relay-compliant`
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
        id: {
            type: new GraphQLNonNull(GraphQLID),
            description: `must be ID! to be relay-compliant`
        },
        counter: {
            type: GraphQLInt,
            resolve: (root, args, {loader}) => {

                debugger
                return counter
            }
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
    ),
    interfaces: [nodeInterface]
}
)


const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        store: {
            type: StoreType,
            args: {
                id: { type: GraphQLString }
            },
            resolve: (root, args, {loaders}) => {
                debugger;
                console.log(root)
                console.log('got a root query.... args = ' + JSON.stringify(args))
                const store = new Store()
                store.id = 'store_1'
                return store
            }
        }
    })
})


const mutationInputType = new GraphQLInputObjectType({
    name: 'Muation_Input',
    fields: {
        clientMutationId: {
            type: new GraphQLNonNull(GraphQLString)
        }
    }
})

const mutationOutputType = new GraphQLObjectType({
    name: "Muation_Output",
    fields: {
        clientMutationId: {
            type: new GraphQLNonNull(GraphQLString)
        },
        store: {
            type: StoreType,
            resolve: () => {
                const store = new Store()
                store.id = 'store_2'
                return store
            }
        }

    }
})

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        incrementCounter: {
            type: mutationOutputType,
            args: {
                input: {
                    type:mutationInputType}
            },
            resolve: (root, args) => ({
                clientMutationId: 'mutation_client_id',
                counter: ++counter,
            })
        },
        message: {
            type: GraphQLString,
            resolve: () => 'hello,world!'
        }
    })
})

const schema = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
})

export default schema
export {
    PersonType,
    StoreType
}