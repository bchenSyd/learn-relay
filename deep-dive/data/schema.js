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
import {
    fromGlobalId,
    globalIdField,
    nodeDefinitions,
} from 'graphql-relay'
import { nodeInterface, nodeField } from './nodeInterface'
let counter = 10

export class Person { }
export class Store { }

//********************************** */
const person_db = [] //should read from database
const store = new Store()  //single tone; global instance;
store.id=1
//********************************** */


const status_array = ['any', 'in_progress', 'passed']
status_array.forEach((s, index) => {
    const person = new Person();
    person.id=index;
    person.first_name = 'bo_' + index;
    person.last_name = 'chen';
    person.age = 30+ index;
    person.status = s
    person.friends = [2, 3, 4];
    person_db.push(person)
})

const getPerson = id => {
    return person_db.find(p => p.id === id)
}

const getPersonFromStatus = status => {
    const result = person_db.find(p => p.status === status)
    console.log(result)
    return result
}

const getStore = () => {
    return store
}

//******************************************************************** */
// the nodeInterface is not an interfaces, but an instance of GraphQLInterfaceType
// it does two things:
// 1. specify what fields the implementation class (which is an GraphQLObjectType) must implementation
// 2. it (optionally) tells graphql what object can be converted to the graphqlObjectType
const PersonType = new GraphQLObjectType({
    name: 'Person',
    fields: () => ({
        //id: globalIdField('Game'),
        id:{
            type:new GraphQLNonNull(GraphQLID),
            resolve:obj=>'Person:'+obj.id
        },
        name: {
            type: GraphQLString,
            resolve: (obj) => `${obj.first_name} ${obj.last_name}`
        },
        age: {
            type: GraphQLInt
        },
        status: {
            type: GraphQLString
        }
    }),
    //GraphQLInterfaceType default to graphqlObjectType::isTypeOf to tell where an object can be converted to graphqlObjectType
    //isTypeOf?: GraphQLIsTypeOfFn<TSource, TContext>;
    interfaces: [nodeInterface]
})

const StoreType = new GraphQLObjectType({
    name: 'Store',
    description: '...',

    fields: () => ({
        //id: globalIdField('Store'),
        id:{
            type:new GraphQLNonNull(GraphQLID),
            resolve:obj=>`Store:${obj.id}`
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
            args: {
                status: {
                    type: GraphQLString,
                    defaultValue: 'any'
                }
            },
            resolve: (root, args) =>
                new Promise((resolve, reject) => {
                    console.log(args)
                    setTimeout(function () {
                        resolve(getPersonFromStatus(args.status)); // query database
                    }, 2 * 1000);
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
        node: nodeField, //this is required for  relay query variables
        store: {
            type: StoreType,
            args: {
                id: { type: GraphQLString }
            },
            resolve: (root, args, {loaders}) => {
                //debugger; //you don't have to set break point this way with Chrome debugger protocal (node2)
                console.log(root)
                console.log('got a root query.... args = ' + JSON.stringify(args))
                return getStore()
            }
        }
    })
})

//************************************************       Mutation        ******************************************************/
//**********************************************************************************************************************************
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
                return getStore()
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
                    type: mutationInputType
                }
            },
            resolve: (root, args) => (new Promise((resolve, reject) => {
                setTimeout(function () {
                    resolve({
                        clientMutationId: 'mutation_client_id',
                        counter: ++counter,
                    })
                }, 2 * 1000)
            }))
        }
    })
})
//**********************************************************************************************************************************
//**********************************************************************************************************************************

const schema = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
})

export default schema
export {
    PersonType,
    StoreType,
    getPerson,
    getStore
}