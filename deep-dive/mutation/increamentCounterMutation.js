import Relay, { Mutation } from 'react-relay'

class increamentCounterMutation extends Mutation {
    //i'm expecting that the fragment declared here be part of my parent's fragment declaration, 
    //          and that the parent will pass in props like {store:__fragment__} which can be resolved in store
    //RelayConatiner:  ComponentWillMount -> setState -> _initialize -> validateFragmentProp -> getQueryDate -> render() -> Object.assign({}, this.props, this.queryData)
    //If I can't see the __fragment__ , that's an anti pattern and relay will throw warning
    static fragments = {
        //generally speaking, since a graphql can only have one root field, that rootfield usually doesn't have a ID bound to it;
        //hence in relay treasure hunt example, it doesn't return id for the store/viewer/game
        //in our example though, we decided to return an id for the `store`, and this make the root fied of graphql query be aware of id
        // the upshort is if (this._rootCallMap.hasOwnProperty(storageKey) && this._rootCallMap[storageKey].hasOwnProperty(identifyingArgValue)) 
        // in RelayRecordStore.js will have `identifyingArgValue` as the `id` in your store;
        // therefore, in your getOptimisticResponse() method, you should return an id field as well!

        //in short, to make optimistic update work, the getOptimisticResponse() must return the SAME data set as the graphQL server does;
        //this is extremely important in terms of `id` field; otherwise relay gets confused and don't know which record to update
        store: () => Relay.QL`
            fragment on Store{
                id,
                counter,
                bchen:id
            }`
    }

    getMutation() {
        return Relay.QL`mutation{incrementCounter}`
    }

    //***************************************************************************** */
    
    getFatQuery() {
        return Relay.QL`
            fragment on Muation_Output @relay(pattern: true){
                store {
                    counter
                }
            }
        `
    }
    // tell relay how to handle the mutation response.
    // the fieldIDs (could be Array<DataId>) in getConfigs() must match the fieldName specified in fatQuery();
    getConfigs() {
        return [{
            //when specifying 'FIELDS_CHANGE' AS mutation type, you need to tell relay which record will be changed;
            type: 'FIELDS_CHANGE',
            fieldIDs: {
                //if the fieldId passed in here doesn't match returned mutationPayload id, the payload will get ignored;
                store: this.props.store.id,
            },
        }];
    }
    //***************************************************************************** */

    getVariables() {
        return {}
    }

    getOptimisticResponse() {
        return {
             //in short, to make optimistic update work, the getOptimisticResponse() must return the SAME data set as the graphQL server does;
            //this is extremely important in terms of `id` field; otherwise relay gets confused and don't know which record to update

            // the root field (store, viewer, game) normally doesn't have `id` field since it's unique in a graphql query;
            // however, in our example, our root field `store` has an `id` field, and this will cause relay to set `identifyingArgValue` for the store
            // if (this._rootCallMap.hasOwnProperty(storageKey) && this._rootCallMap[storageKey].hasOwnProperty(identifyingArgValue)) 
            // see: E:\relay-digest\traversal\writeRelayUpdatePayload.js line:178
            store: {
                id: this.props.store.id,  //and hence this is required!
                counter: this.props.store.counter + 1
            }

            // I'm emphasize it for the 3rd time!
            //in short, to make optimistic update work, the getOptimisticResponse() must return the SAME data set as the graphQL server does;
            //this is extremely important in terms of `id` field; otherwise relay gets confused and don't know which record to update
        }
    }
}

export default increamentCounterMutation