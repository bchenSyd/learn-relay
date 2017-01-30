import React, { Component } from 'react'
import Relay from 'react-relay'

import increamentCounter from '../../mutation/increamentCounterMutation'
import Person from './Person'


class StoreContainer extends Component {

    _onMutate = event => {
        const {relay} = this.props
        relay.commitUpdate(
            /* the Mutation expects the prop passed in has a fragment called 'store' (defined in its fragment builder) defined; otherwise Relay will throw an warning (anti pattern) */
            // if you don't include Person Component's fragment in Person's fragment builder, you get the same warning 
            new increamentCounter({ store: store })
        )
    }

    _onSearch = (event) => {
        const {relay} = this.props
        relay.setVariables({
            status: event.target.value
        })
    }

    _displayPendingMutation = () => {
        const {store, relay} = this.props
        const transactions = relay.getPendingTransactions(store)
        let hasPendingTrx = transactions && transactions.length > 0
        const hasOptimisticUpdate = relay.hasOptimisticUpdate(store)
        console.log(` hading pending transaction? ${hasPendingTrx}  --- hasOptimisticUpdate ? ${hasOptimisticUpdate}  ; most of the time , they should be synchronized`)
        if (hasPendingTrx) {
            return <h2>
                mutation-> send request -> get response ->
                    storeChange ---> GraphQLStoreChangeEmitter::_processSubscriber -> GraphQLStoreSingleQueryResolver::_handleChange -> RelayContainer._handleFragmentDataUpdate
                </h2>
        }
    }

    _displayPendingQuery = () => {
       const {variables: {status}, pendingVariables} = this.props.relay
        if (pendingVariables && 'status' in pendingVariables) {
            return <h2>RelayContainer.setVariables()=> this.context.relay.environment.primeCache(callback= relayContainer.onReadyStateChange) =>
                        storeData.getQueryRunner => GraphqlQueryRunner.run => GraphqlQueryRunner.runQueryies => RelayNetworkLayer...</h2>

        }
    }

    render() {

        const { store, store: { counter, person}, relay } = this.props
        const {variables: {status}, pendingVariables} = relay
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
                {/* display person*/}
                <Person person={person} />
            </div>
        </div>)
    }
}

export default Relay.createContainer(StoreContainer, {
    initialVariables: {
        storeId: null,
        status: 'any'
    },
    fragments: {
        store: () => Relay.QL`
        fragment on Store {
            counter,
            ${increamentCounter.getFragment('store')}
             person (status: $status ){
                   ${Person.getFragment('person')}
             }
        }`
    }
})
