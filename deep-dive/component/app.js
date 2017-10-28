import React from 'react'
import Relay from 'react-relay/classic'
import SearchContainer from './Containers/SearchContainer'

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
            {/* why does my `relay.pendingVariables` already return null?
                1. this.setVariables => change relay instance (the one in context) => 
                   simply do {...props} to make sure new relay instance is passed in (so that `relay.pendingVarialbes` won't be null)

                2. you must forward status={props.status} as render variables (in props)
                   need to match fetch varialbes (in fragment variables overrides)
                //source code see: D:\__work\relay-digest\container\RelayContainer.ts line:540
           */}
            <SearchContainer  viewer={props.viewer}  status={props.status} relay={props.relay}/>
        </div>
    );
};

App = Relay.createContainer(App, {
    //!critical
    //below line is also requied. Relay will  sync   [pram  in Route.paramDefinitions]   with   [ varaibles declared in Component.initialVariables]
    initialVariables: {
        status: 'anyxyz-doesnot-matter'
    },

    fragments: {
        //    (variables)      here is declared in initialVariables method above
        viewer: (variables) => Relay.QL`
            fragment on Viewer{
              ${SearchContainer.getFragment('viewer', variables)}
            } `
    }
})

export default App