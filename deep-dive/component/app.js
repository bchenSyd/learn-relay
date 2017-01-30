import React from 'react'
import Relay from 'react-relay'
import Store from './Containers/Store'

const default_status = 'in_progress'
let App = (props) => {

    console.log(` *****************   the param:status passe from route  is ${props.status} `)
    return (
        <div id='app'>
            <div id='relay-stores'>
                <ul>
                    <li>_queuedStore: RelayRecordStore;</li>
                    <li>_recordStore: RelayRecordStore;</li>
                    <li style={{ color: 'grey' }}>_cachedStore: RelayRecordStore;</li>
                </ul>
            </div>
            {/* CATCH
                1. this.setVariables => change relay instance => 
                so, if you want your component to **immediately**   re-render after setVariables
                you need to pass relay here, or  simply do {...props} 
                2. you must forward status={props.status} to <Store> component
                   becuase you have  ${Store.getFragment('store', variables)} which override Store's default variables

           */}
            <Store  store={props.store}    relay={props.relay}  status={props.status}/>
        </div>
    );
};

App = Relay.createContainer(App, {
    //!critical
    //below line is also requied. Relay will  sync   [pram  in Route.paramDefinitions]   with   [ varaibles declared in Component.initialVariables]
    initialVariables: {
        status: 'any'
    },

    fragments: {
        //    (variables)      here is declared in initialVariables method above
        store: (variables) => Relay.QL`
            fragment on Store{
              ${Store.getFragment('store', variables)}
            } `
    }
})

export default App