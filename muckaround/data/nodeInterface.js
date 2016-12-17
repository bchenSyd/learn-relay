import {
    GraphQLInterfaceType,
    GraphQLNonNull,
    GraphQLID
} from 'graphql'

import { Person,PersonType } from './schema'
const nodeInterface = new GraphQLInterfaceType({
    name: 'Node',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLID)
        }
    },
    resolveType: (obj)=>{
        if(obj instanceof Person){
            return PersonType
        }
        return null
    }
})

export default nodeInterface