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
            {/* CATCH
                1. this.setVariables => change relay instance => 
                so, if you want your component to **immediately**   re-render after setVariables
                you need to pass relay here, or  simply do {...props} 
                2. you must forward status={props.status} to <SearchContainer> component
                   becuase you have   ${SearchContainer.getFragment('viewer', variables)} which override SearchContainer's default variables
                //source code see: D:\__work\relay-digest\container\RelayContainer.ts line:540
           */}
            <SearchContainer  viewer={props.viewer}  status={props.status}/>
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