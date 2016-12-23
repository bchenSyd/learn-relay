import {
    GraphQLInterfaceType,
    GraphQLNonNull,
    GraphQLID
} from 'graphql'

import { Person, PersonType, Store, StoreType } from './schema'
const nodeInterface = new GraphQLInterfaceType({
    name: 'Node',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLID)
        }
    },
    //if you don't implement resolveType (which is optional), you get:
    //Error: Interface Type Node (the 'Node' name) does not provide a "resolveType" function and implmenting Type PersonType does not
    //provide a "isTypeOf" function. there is no way to resovle this implmentation

    /**
         * Optionally provide a custom type resolver function. If one is not provided,
         * the default implementation will call `isTypeOf` on each implementing
         * Object type.
   */
    resolveType: (obj) => {
        if (obj instanceof Person) {
            return PersonType
        } else if (obj instanceof Store) {
            return StoreType
        }
        return null
    }
})

export default nodeInterface