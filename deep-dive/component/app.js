import React, { Component } from 'react'
import Relay from 'react-relay'
import Store from './Containers/Store'


const some_data_from_parent = 'some-data-from-parent'  //in most of cases, 'some-data-from-parent' is a field value returned from root query
class App extends Component {

    constructor(props) {
        super(props)
        this.state ={
            dummy: 0
        }
    }

    componentWillMount() {
        const { relay } = this.props
        relay.setVariables({
            parentVal: some_data_from_parent
        })
    }
    //transform class properties , a babel stage2 feature
    _refresh= ()=>{
        this.setState({dummy:'new dummy'})
    }

    render() {

        const { store, status, relay, relay: { variables: { parentVal } } } = this.props
        //console.log(` *****************   the param:status passe from route  is ${props.status} `)
        return (
            <div id='app'>
                <div id='relay-stores'>
                    <h2>equivalent of Events.tsx</h2>
                    <ul>
                        <li>_queuedStore: RelayRecordStore;</li>
                        <li>_recordStore: RelayRecordStore;</li>
                        <li style={{ color: 'grey' }}>_cachedStore: RelayRecordStore;</li>
                        <li><button onClick={this._refresh}>  setState()</button></li>
                    </ul>
                </div>
                {/* CATCH
                1. this.setVariables => change relay instance => 
                so, if you want your component to **immediately**   re-render after setVariables
                you need to pass relay here, or  simply do {...props} 
                2. you must forward status={props.status} to <Store> component
                   becuase you have  ${Store.getFragment('store', variables)} which override Store's default variables
                //source code see: D:\__work\relay-digest\container\RelayContainer.ts line:540
           */}
                <div style={{marginTop:'10px'}}>   
                    <Store store={store}
                        relay={relay}  //don't delete!!!!  Store needs this to re-render as soon as you call setVarialbes (otherwise you never see pending variables!)
                        status={status}
                        parentVal={parentVal}
                    />
                </div>

            </div>
        )
    }

}

App = Relay.createContainer(App, {
    //!critical
    //below line is also requied. Relay will  sync   [pram  in Route.paramDefinitions]   with   [ varaibles declared in Component.initialVariables]
    initialVariables: {
        status: 'any', //overriden by router;
        parentVal: null //a dependent variabled returned from rootQuery (relay doesn't like undefined; use null instead!)
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