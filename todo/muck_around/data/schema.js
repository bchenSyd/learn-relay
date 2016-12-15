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
                first_name:'Joanna',
                last_name:'chen',
                age:6
            }])
        }
    })
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
                resolve: (root, args) => ({
                    first_name: 'bo',
                    last_name: 'chen',
                    age: 34,
                    friends: [2, 3, 4]
                  
                })
            }
        })
    })

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name:'Query',
        fields:()=> ({
            store:{
                type: StoreType,
                resolve:()=>({})
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