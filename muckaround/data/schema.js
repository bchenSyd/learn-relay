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

const PersonType = new GraphQLObjectType({
    name: 'Person',
    fields: () => ({
        id: {
            type: new  GraphQLNonNull(GraphQLID),
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
    interfaces: [nodeInterface]
})

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
            resolve: (root, args) => {
                const person = new Person();
                person.id = 1;
                person.first_name = 'bo';
                person.last_name = 'chen';
                person.age = 34;
                person.friends = [2, 3, 4];
                return person;
            }
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