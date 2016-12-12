import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql'

let counter = 10

const PersonType = new GraphQLObjectType({
    name: 'Person',
    fields: () => ({
        id: {
            type: GraphQLInt,
            resolve: () => ++counter
        },
        name: {
            type: GraphQLString,
            resolve: (obj) => `${obj.first_name} ${obj.last_name}`
        },
        age: {
            type: GraphQLInt
        },
        debug:{
            type:GraphQLString
        },
        friends: {
            type: new GraphQLList(PersonType),
            resolve: (obj) => ([{
                id:obj.friends[0],
                first_name:'Joanna',
                last_name:'chen',
                age:6,
                friends:[1,3],
                debug: `from ${obj.id}`
            }])
        }
    })
})

const QueryType = new GraphQLObjectType({
        name: 'Query',
        description: '...',

        fields: () => ({
            counter: {
                type: GraphQLInt,
                resolve: () => counter
            },
            person: {
                type: PersonType,
                args: {
                    id: { type: GraphQLInt }
                },
                resolve: (root, args) => ({
                    id: 1,
                    first_name: 'bo',
                    last_name: 'chen',
                    age: 34,
                    friends: [2, 3, 4],
                    debug:`${args.id}`
                })
            }
        })
    })

const schema = new GraphQLSchema({
    query: QueryType,

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