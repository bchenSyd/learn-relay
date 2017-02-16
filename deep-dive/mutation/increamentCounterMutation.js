import Relay, { Mutation } from 'react-relay'

class increamentCounterMutation extends Mutation {   
    static fragments = {
        //generally speaking, since a graphql can only have one root field, that rootfield usually doesn't have a ID bound to it;
        viewer: () => Relay.QL`
            fragment on Viewer{
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
                viewer {
                    counter
                }
            }
        `
    }
    // tell relay how to handle the mutation response.
    // the fieldIDs (could be Array<DataId>) in getConfigs() must match the fieldName specified in fatQuery();
    getConfigs() {
        console.log(`clinet dataID for returned field  ${this.props.viewer.__dataID__}`)
        return [{
            //when specifying 'FIELDS_CHANGE' AS mutation type, you need to tell relay which record will be changed;
            type: 'FIELDS_CHANGE',
            fieldIDs: {
                //if the fieldId passed in here doesn't match returned mutationPayload id, the payload will get ignored;
                viewer: this.props.viewer.__dataID__,
            },
        }];
    }
    //***************************************************************************** */

    getVariables() {
        return {}
    }

    getOptimisticResponse() {
        return {
            viewer: {
                counter: this.props.viewer.counter + 1
            }

            // I'm emphasize it for the 3rd time!
            //in short, to make optimistic update work, the getOptimisticResponse() must return the SAME data set as the graphQL server does;
            //this is extremely important in terms of `id` field; otherwise relay gets confused and don't know which record to update
        }
    }
}

export default increamentCounterMutation