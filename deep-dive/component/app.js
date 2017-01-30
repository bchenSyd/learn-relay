import React from 'react'
import Relay from 'react-relay'
import Store from './Containers/Store'

const default_status = 'in_progress'
let App = (props) => {

    return (
        <div id='app'>
            <div id='relay-stores'>
                <ul>
                    <li>_queuedStore: RelayRecordStore;</li>
                    <li>_recordStore: RelayRecordStore;</li>
                    <li style={{ color: 'grey' }}>_cachedStore: RelayRecordStore;</li>
                </ul>
            </div>
            <Store  store={props.store}/>
        </div>
    );
};

// 1. you have to forward fragment definition otherwise relay will complain
// 2. override child fragment variables

// To do this, we have to ensure that both the fragment and the container know about the custom variable.
// https://facebook.github.io/relay/docs/api-reference-relay-container.html#getfragment

App = Relay.createContainer(App, {
    fragments: {
        store: () => Relay.QL`
            fragment on Store{
              ${Store.getFragment('store')}
            } `
    }
})

export default App