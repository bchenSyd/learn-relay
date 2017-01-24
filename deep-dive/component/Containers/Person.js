import React, { Component } from 'react'
import Relay from 'react-relay'

import PersonTemplate from '../Templates/PersonTemplate'
import increamentCounter from '../../mutation/increamentCounterMutation'
//When using Relay, a react component should be mapped to a graphQL Type
//the landing page is mapped to viewer/store fo graphql root query
class Person extends Component {

    _onMutate = event => {
        this.props.relay.commitUpdate(
            /* the Mutation expects the prop passed in has a fragment called 'store' (defined in its fragment builder) defined; otherwise Relay will throw an warning (anti pattern) */
            // if you don't include Person Component's fragment in Person's fragment builder, you get the same warning 
            new increamentCounter({ store: this.props.store })
        )
    }


    onSearch(event) {
        const {relay} = this.props
        relay.setVariables({
            status:  event.target.value
        })
    }

    render() {

        const {store, store: { counter, person}, relay  } = this.props

        const transactions = relay.getPendingTransactions(store)
        let hasPendingTrx = transactions && transactions.length > 0
        const hasOptimisticUpdate = relay.hasOptimisticUpdate(store)
        console.log(` hading pending transaction? ${hasPendingTrx}  --- hasOptimisticUpdate ? ${hasOptimisticUpdate}  ; most of the time , they should be synchronized`)


        return (
            <div>
                {hasPendingTrx && <h2>while waiting for server's response, i'm giving an optimistic update on counter</h2>}
                <div>counter:{counter}</div>
                <div>
                    <select name = 'person_filter_dp'  onChange={this.onSearch.bind(this)} >
                        <option value='any'>Any</option>
                        <option value='in_progress'>In Progress</option>
                        <option value='passed'>Passed</option>
                    </select>
                </div>
                <PersonTemplate person={person} />
                <button onClick={this._onMutate} >Mutation</button>

            </div>
        )
    }
}


const inLineFragment = Relay.QL`
        fragment on Person{
           id
    }`
//one rootquery can only contains one fragment and no fields. the fragment and root query must share the same name
//the fragmentReference (returned by Relaycontainer.getFragment) will be replaced with the actual fetched data ONLY IF name matches
//so if you put fragment name to `store2`, at runtime, the value is `null`
Person = Relay.createContainer(Person, {
    initialVariables:{
        status: 'any'
    },

    //this is called 'fragment builder'
    fragments: {
        // you can call the fragement whatever you want, but the name you picked here must be 
        // consistent with the query name in homeRoute rootQuery name
        // bchen:change fragment name to `store2`
        store: () => Relay.QL`
            fragment on Store{
                counter,
                ${increamentCounter.getFragment('store')}
                person (status: $status ){
                    ${inLineFragment}
                    ${PersonTemplate.getFragment('person')}
                }
            } `
    }
})
export default Person
