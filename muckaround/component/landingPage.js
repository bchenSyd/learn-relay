import React, { Component } from 'react'
import Relay from 'react-relay'
import Person from './person'

//When using Relay, a react component should be mapped to a graphQL Type
//the landing page is mapped to viewer/store fo graphql root query
class LandingPage extends Component {
    render() {
      
        const {store1: { counter , person}  } = this.props
        console.log(`insert your break point here...  ${person.name}`)
        return (
            <div>
                <div>counter:{counter}</div>
                {/* this won't cause issue*/}
                <h2>person name: {person.name}</h2> 
                {/* this cause a warning: component PersonComponent was rendered with variables that differ from the variables used to fetch fragment person*/}
                <Person person = {person}/>  
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
        store1: () => Relay.QL`
            fragment on Store{
                counter,
                person{
                    
                    ${Person.getFragment('person')}
                }
            }`
    }
})
export default LandingPage
