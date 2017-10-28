import React, { Component } from 'react'
import Relay from 'react-relay'

import increamentCounter from '../../mutation/increamentCounterMutation'
import Person from './Person'


class SearchContainer extends Component {

    _onMutate = event => {
        const { relay, viewer } = this.props
        relay.commitUpdate(
            /* the Mutation expects the prop passed in has a fragment called 'viewer' (defined in its fragment builder) defined; otherwise Relay will throw an warning (anti pattern) */
            // if you don't include Person Component's fragment in Person's fragment builder, you get the same warning 
            new increamentCounter({ viewer: viewer })
        )
    }

    // npm install --save-dev babel-plugin-transform-class-properties
    _onSearch = (event) => {
        const { relay } = this.props
        // !! I could have 2 children <div> <Person /> <Person/> </div>
        // each <Person /> could have different fragment variables;
        //     remember Query is static, a Query contains fragment which is also static; but fragment variables is per instance
        // now when parent start calling setVariables, and because its fragment referenced child fragment, we need to work out child variables
        // but we couldn't becuase we have 2 different ones
        // that's why parent has to override child variables , but this is only to be limited to the case where parent has choosen to do Fragment Override
        // more, see: https://github.com/facebook/relay/issues/1138
        relay.setVariables({
            status: event.target.value
        })
    }

    _displayPendingMutation = () => {
        const { viewer, relay } = this.props
        const transactions = relay.getPendingTransactions(viewer)
        let hasPendingTrx = transactions && transactions.length > 0
        const hasOptimisticUpdate = relay.hasOptimisticUpdate(viewer)
        //console.log(` hading pending transaction? ${hasPendingTrx}  --- hasOptimisticUpdate ? ${hasOptimisticUpdate}  ; most of the time , they should be synchronized`)
        if (hasPendingTrx) {
            return <h2>
                mutation-> send request -> get response ->
                    StoreChange ---> GraphQLStoreChangeEmitter::_processSubscriber -> GraphQLStoreSingleQueryResolver::_handleChange -> RelayContainer._handleFragmentDataUpdate
                </h2>
        }
    }

    _displayPendingQuery = () => {
        const { variables: { status }, pendingVariables } = this.props.relay
        if (pendingVariables && 'status' in pendingVariables) {
            return <h2>RelayContainer.setVariables()=> this.context.relay.environment.primeCache(callback= relayContainer.onReadyStateChange) =>
                        StoreData.getQueryRunner => GraphqlQueryRunner.run => GraphqlQueryRunner.runQueryies => RelayNetworkLayer...</h2>

        }
    }

    render() {
        /*
        after you call relay.setVarialbes(), relayContainer.onReadyStateChange will called multiple times during the fetch process
        everytime RelayContainer.onReadyStateChanged() is called, your component gets re-rendered(), sometimes unnecessarily
        ideally, the render() method should only get called 2 times after a setVariables()
        1. ready == false, variables = initial varialbes,  pendingVariables = new setVarialbes (NETWORK_START)
            1.1. ready == false, variables = initial varialbes,  pendingVariables = new setVarialbes  (unnecessarily) why??
            1.2. ready == false, variables = initial varialbes,  pendingVariables = new setVarialbes  (unnecessarily) why??
        2. ready == true,  variables = new variables ,     pendingVarialbes = null (NETWORK_RECEIVED_ALL)
         */
        const { viewer, viewer: { counter}, relay } = this.props

        // to hand on fragment to child components
        const { variables: { status }, pendingVariables } = relay
        return (<div>
            <div style={{ marginTop: 40 }}>
                {/* handle mutation*/}
                {this._displayPendingMutation()}
                <div>counter:{counter}</div>
                <button onClick={this._onMutate.bind(this)} >Mutation</button>
            </div>


            <div style={{ marginTop: 40, borderTop: 'solid 1px grey' }}>
                {/* handle search*/}
                {this._displayPendingQuery()}
                <div>
                    <select name='person_filter_dp' value={status} onChange={this._onSearch /* auto bind*/} >
                        <option value='any'>Any</option>
                        <option value='in_progress'>In Progress</option>
                        <option value='passed'>Passed</option>
                    </select>
                </div>

            
                {/* pass relay.variables.status to child component*/}
                <Person viewer={viewer} status={status} relay={relay}/>

            </div>
        </div>)
    }
}

export default Relay.createContainer(SearchContainer, {
    initialVariables: {
        status: 'invalidxxx' // to be overidden by react-router
    },
    fragments: {
        viewer: (variables) => Relay.QL`
            fragment on Viewer {
                counter,
                ${increamentCounter.getFragment('viewer')}
                ${Person.getFragment('viewer', variables)} 
            }`
    }
})
