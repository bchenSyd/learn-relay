import React, { Component } from 'react'
import Relay from 'react-relay'

import PersonTemplate from '../Templates/PersonTemplate'
//When using Relay, a react component should be mapped to a graphQL Type
//the landing page is mapped to viewer/store fo graphql root query
class Person extends Component {

    render() {

        const {person  } = this.props

        return (
            <div>
                         
                <PersonTemplate person={person} />
             
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
    //this is called 'fragment builder'
    fragments: {
        // you can call the fragement whatever you want, but the name you picked here must be 
        // consistent with the query name in homeRoute rootQuery name
        // bchen:change fragment name to `store2`
        person: () => Relay.QL`
            fragment on Person{
                    ${inLineFragment}
                    ${PersonTemplate.getFragment('person')}
              
            } `
    }
})
export default Person
