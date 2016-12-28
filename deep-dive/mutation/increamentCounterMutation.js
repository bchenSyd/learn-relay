import Relay, { Mutation } from 'react-relay'

class increamentCounterMutation extends Mutation {
    //i'm expecting that the fragment declared here be part of my parent's fragment declaration, 
    //          and that the parent will pass in props like {store:__fragment__} which can be resolved in store
    //RelayConatiner:  ComponentWillMount -> setState -> _initialize -> validateFragmentProp -> getQueryDate -> render() -> Object.assign({}, this.props, this.queryData)
    //If I can't see the __fragment__ , that's an anti pattern and relay will throw warning
    static fragments = {
        //mutation payload won't have ID field for the root field, see  relay/traversal/writeRelayUpdatePayload.js  handleMerge() method
        //this **implies** that the root field name MUST be the same as the root field name in your store
        //hence naming the root field `mutation_store` won't work in optimistic mutation result
        mutation_store: () => Relay.QL`
            fragment on Store{
                id,
                counter
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
                store: this.props.mutation_store.id,
            },
        }];
    }
    //***************************************************************************** */

    getVariables() {
        return {}
    }

    getOptimisticResponse() {
        return {
            mutation_store: {
                counter: this.props.mutation_store.counter + 1
            }
        }
    }
}

export default increamentCounterMutation