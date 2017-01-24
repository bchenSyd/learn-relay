import React, { Component } from 'react'
import Relay, { createContainer } from 'react-relay'

// Warning: RelayContainer: component `PersonComponent` was rendered with variables that differ from the variables used to fetch fragment `person`. 
// The fragment was fetched with variables `(not fetched)`, but rendered with variables `{}`. This can indicate one of two possibilities: 
//  - The parent set the correct variables in the query - `PersonComponent.getFragment('person', {...})` - but did not pass the same variables when rendering the component. 
//    Be sure to tell the component what variables to use by passing them as props: `<PersonComponent ...  />`.
//  - You are intentionally passing fake data to this component, in which case ignore this warning.

//a react component should map to a graphql objectType
class PersonComponent extends Component {

    onFilter(){
        alert('go')
    }
    render() {
        const {person: {name, age, status}} = this.props
        return (
            <div>
                <div id='search_result'>
                    <div style={{marginTop:10}}>
                        <span>name  --  </span>
                        <span>{name}</span>
                    </div>
                     <div style={{marginTop:10}}>
                        <span>age  --  </span>
                        <span>{age}</span>
                    </div>
                     <div style={{marginTop:10}}>
                        <span>status  --  </span>
                        <span>{status}</span>
                    </div>
                </div>
            </div>
        )
    }

}

export default createContainer(PersonComponent, {
    fragments: {
        //think of `fragment on` as React Component property definition
        //the property name must be the field name defined in graphql
        //you **cannot** pick a random name here as in root fragment
        person: () => Relay.QL`
            fragment on Person{
                name,
                age,
                status,
                id
            }`
    }
})