import React, { Component } from 'react'
import Relay from 'react-relay'

import increamentCounter from '../../mutation/increamentCounterMutation'
import Person from './Person'


class StoreContainer extends Component {

    fetchMeetingDropdown(relay, nextProps) {
        const {store:{country_code}, relay:{variables:{parentVal}}} = nextProps
        relay.setVariables({
            country_code: country_code,
            parentVal:parentVal
        })
    }

    componentWillReceiveProps(nextProps) {
        const {relay: {variables}} = this.props
        const {relay, relay: {variables: nextVariables}} = nextProps
        if (!variables.parentVal && nextVariables.parentVal) {
            //first time parentVal gets resolved
            this.fetchMeetingDropdown(relay, nextProps)
        }
    }


    _onMutate = event => {
        const {relay, store} = this.props
        relay.commitUpdate(
            /* the Mutation expects the prop passed in has a fragment called 'store' (defined in its fragment builder) defined; otherwise Relay will throw an warning (anti pattern) */
            // if you don't include Person Component's fragment in Person's fragment builder, you get the same warning 
            new increamentCounter({ store: store })
        )
    }

    _onSearch = (event) => {
        const {relay, relay: {variables}} = this.props
        relay.setVariables({
            status: event.target.value
        })
    }

    _displayPendingMutation = () => {
        const {store, relay} = this.props
        const transactions = relay.getPendingTransactions(store)
        let hasPendingTrx = transactions && transactions.length > 0
        const hasOptimisticUpdate = relay.hasOptimisticUpdate(store)
        //console.log(` hading pending transaction? ${hasPendingTrx}  --- hasOptimisticUpdate ? ${hasOptimisticUpdate}  ; most of the time , they should be synchronized`)
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
        /*
        after you call relay.setVarialbes(), relayContainer.onReadyStateChange will called multiple times during the fetch process
        everytime RelayContainer.onReadyStateChanged() is called, your component gets re-rendered(), sometimes unnecessarily
        ideally, the render() method should only get called 2 times after a setVariables()
        1. ready == false, variables = initial varialbes,  pendingVariables = new setVarialbes (NETWORK_START)
            1.1. ready == false, variables = initial varialbes,  pendingVariables = new setVarialbes  (unnecessarily) why??
            1.2. ready == false, variables = initial varialbes,  pendingVariables = new setVarialbes  (unnecessarily) why??
        2. ready == true,  variables = new variables ,     pendingVarialbes = null (NETWORK_RECEIVED_ALL)
         */
        const { store, store: { counter, meetingDropDown, person}, relay } = this.props
        const {variables, variables: {status}, pendingVariables} = relay


        console.log(`                render()  varialbes:${JSON.stringify(variables)}   --- pendingVariables ${JSON.stringify(pendingVariables)}`)
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
                {meetingDropDown && <div style={{ color: 'red' }}>{meetingDropDown}</div>}
                {/* display person*/}
                {person && <Person person={person} />}
            </div>
        </div>)
    }
}

export default Relay.createContainer(StoreContainer, {
    initialVariables: {
        status: 'any',
        parentVal: null, //relay doesn't like undefined; use null instead!
        shouldFetchPerson: false, // dependent query controlled by parent
        country_code: null,
        shouldFetchMeetings: false //dependent query controlled by self
    },
    //1. run rootquery
    //2. rootQuery returns. RelayContainer(Parent)._getQueryData() 
    //3. parent  cwm begins, explicitly setVariables
    //4. RelayContainer(Store), _initialize, build nextVariables
    //5. Store  cwm begins, explicitly setVarialbes
    //   Store::render() is called here with **all** default variables
    //   Store::render() is called once step 5 is resolved with updated varialbes....
    //7. parent cwm query returns, RelayContainer(Store).componentWillReceiveprops => setstate(oldstate) { this._initialize(newVarialbes, oldVariables)}
    //   Store::render() is called with updated varialbes (which override the country_code)
    /*
    Store.js:119 ++++++++++++  prepareVariables  {"status":"passed","parentVal":null,"shouldFetchPerson":false,"country_code":null}
    Store.js:119 ++++++++++++  prepareVariables  {"status":"passed","parentVal":null,"shouldFetchPerson":false,"country_code":null}
    Store.js:119 ++++++++++++  prepareVariables  {"status":"passed","parentVal":"some-data-from-parent","shouldFetchPerson":true,"country_code":null}
    Store.js:119 ++++++++++++  prepareVariables  {"status":"passed","parentVal":null,"shouldFetchPerson":false,"country_code":null}
    Store.js:119 ++++++++++++  prepareVariables  {"status":"passed","parentVal":null,"shouldFetchPerson":false,"country_code":11}
    Store.js:71                 render()  varialbes:{"status":"passed","parentVal":null,"shouldFetchPerson":false,"country_code":null}   --- pendingVariables null
    Store.js:71                 render()  varialbes:{"status":"passed","parentVal":null,"shouldFetchPerson":false,"country_code":11}   --- pendingVariables null
    Store.js:119 ++++++++++++  prepareVariables  {"status":"passed","parentVal":"some-data-from-parent","shouldFetchPerson":true,"country_code":null}
    Store.js:71                 render()  varialbes:{"status":"passed","parentVal":"some-data-from-parent","shouldFetchPerson":true,"country_code":null}   --- pendingVariables null
    
     */
    prepareVariables: prevVars => {
        const newVars = Object.assign({}, prevVars, {
            shouldFetchMeetings: !!prevVars.country_code,
            shouldFetchPerson: !!prevVars.parentVal
        });
        console.log(`++++++++++++  prepareVariables  ${JSON.stringify(newVars)}`)
        return newVars
    },
    fragments: {
        store: () => Relay.QL`
        fragment on Store {
            counter,

             #*************************************************************************************************************
             #depends on which dependent query comes first; the one comes latter will flush out the one comes first
             # meeting: 0.5s , person 2s; so you will only see person info now
             #simulate meeting dropdown where data is fetched based on $race_type, $country_code and $race_date
             country_code,
             meetingDropDown(country_code:$country_code) @include(if: $shouldFetchMeetings),


             #simulate matchup events. matchupIds is passed from parent which is Event.tsx
             person (status: $status, dummy:$parentVal ) @include(if: $shouldFetchPerson){
                   ${Person.getFragment('person')}
             },
             #**************************************************************************************************************
            #mutation area
            ${increamentCounter.getFragment('store')}
        }`
    }
})
