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
                <h2>person name: {person.name || 'undefined'}</h2> 
                {/* this cause a warning: component PersonComponent was rendered with variables that differ from the variables used to fetch fragment person*/}
                
                {/* Look! here we explicitly pass a fragment property value to child component
                    but we don't have this luxus for the Root React Component as we don't explicitly set property for our Root React Component, 
                    Relay will do that implicitly;
                    this is because the rootQuery can only have one fragment, and no fields, and that particular fragment must be the fragment declared in React Root Component
                    so relay knows how to do it;
                    Based on this, if you fool Relay but literally obeying the rule , i.e. having a query like  Relay.QL`query{store{ ... on Store{ counter, blablabla...}}`
                    this will successfully bypass Relay query validation system, becuase your rootQuery does only have one (inline) fragment and no fields
                    **However** since React Root Container won't have the luxry of setting properties by developer, and that the fragment declared in React Root Component isn't 
                    referenced in Rect.Route, Relay just simply ignores your fragment property and hence you fragment property will be null
                    Warning: RelayContainer: Expected prop `person` to be supplied to `PersonComponent`, but got `undefined`. Pass an explicit `null` if this is intentional.
                    Error: cannot access name of undefined
                */}
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
