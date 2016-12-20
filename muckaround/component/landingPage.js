import React, { Component } from 'react'
import Relay from 'react-relay'
import Person from './person'

//When using Relay, a react component should be mapped to a graphQL Type
//the landing page is mapped to viewer/store fo graphql root query
class LandingPage extends Component {
    render() {
        console.log('insert your break point here...')
        const {store1: { counter, person} } = this.props
        return (
            <div>
                <div>counter:{counter}</div>
                <Person person={person} />
            </div>
        )
    }
}

//one rootquery can only contains one fragment and no fields. the fragment and root query must share the same name
//the fragmentReference (returned by Relaycontainer.getFragment) will be replaced with the actual fetched data ONLY IF name matches
//so if you put fragment name to `store2`, at runtime, the value is `null`
LandingPage = Relay.createContainer(LandingPage, {
    fragments: {
        // you can call the fragement whatever you want, but the name you picked here must be 
        // consistent with the query name in homeRoute rootQuery name
        // bchen:change fragment name to `store2`
        store1: () => {
            const fragmentQuery = Relay.QL`
            fragment on Store{
               counter,
               person{
                 ${Person.getFragment('person')}
               }
               
            }`
            //deprecated: let component express what they need. if PersonComponent in the future needs more data, 
            //            we should only update PersonComponent , but its parent
            //the concept of `let's component express what they need` is strongly advocated by relay
            const inlineQuery = Relay.QL`
            fragment on Store{
                counter,
                person{
                    id,
                    name,
                    age
                }
            }`
            return inlineQuery
        }
    }
})
export default LandingPage
