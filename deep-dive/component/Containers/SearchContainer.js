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

    _onSearch = (event) => {
        const { relay } = this.props
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
        const { variables: { status, countryCode }, pendingVariables } = relay
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
                    <select name='person_filter_dp' value={status} onChange={this._onSearch.bind(this)} >
                        <option value='any'>Any</option>
                        <option value='in_progress'>In Progress</option>
                        <option value='passed'>Passed</option>
                    </select>
                </div>

            
                {/* pass relay.variables.status to child component*/}
                <Person viewer={viewer} status={status} relay={relay} countryCode={countryCode}/>

            </div>
        </div>)
    }
}

export default Relay.createContainer(SearchContainer, {
    initialVariables: {
        status: 'any',
        countryCode:'parent'
        // searchContainer has no knowledge of countryCode
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
