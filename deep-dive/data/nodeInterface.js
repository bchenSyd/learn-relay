import {
    GraphQLInterfaceType,
    GraphQLNonNull,
    GraphQLID
} from 'graphql'
import {
    fromGlobalId,
    nodeDefinitions,
} from 'graphql-relay'
import { Person, PersonType, getPerson } from './schema'


//******************************************************************************************
//                     Define Query
//******************************************************************************************
// step 1: let's define a node interface and type
// We need only provide a way for Relay to map 
// 1. given a global ID, you need to return me the object
// 2. given an Object , you need to tell me the graphQLType
const {nodeInterface, nodeField} = nodeDefinitions(
    (globalId) => {
        //const {type, id} = fromGlobalId(globalId);
        const [type,id] = globalId.split(':')
        if (type === 'Person') {  //should match const PersonType = new GraphQLObjectType({  name: 'Person',
            return getPerson(id);
        } else {
            return null;
        }
    },
    (obj) => {
        if (obj instanceof Person) {
            return PersonType
        } 
        return null
    }
)



export { nodeInterface, nodeField } 