import Relay, { Mutation } from 'react-relay'

class increamentCounterMutation extends Mutation {
    //i'm expecting that the fragment declared here be part of my parent's fragment declaration, 
    //          and that the parent will pass in props like {store:__fragment__} which can be resolved in store
    //RelayConatiner:  ComponentWillMount -> setState -> _initialize -> validateFragmentProp -> getQueryDate -> render() -> Object.assign({}, this.props, this.queryData)
    //If I can't see the __fragment__ , that's an anti pattern and relay will throw warning
    static fragments = {
        store: () => Relay.QL`
            fragment on Store{
                counter
            }`
    }

    getMutation() {
        return Relay.QL`mutation{incrementCounter}`
    }

    getFatQuery() {
        return Relay.QL`
            fragment on Muation_Output @relay(pattern: true){
                store {
                    counter
                }
            }
        `
    }

    getVariables(){
        return {}
    }
    getConfigs() {
        return [{
            type: 'FIELDS_CHANGE',
            fieldIDs: {
               store: this.props.store.id,
            },
        }];
    }
}

export default increamentCounterMutation