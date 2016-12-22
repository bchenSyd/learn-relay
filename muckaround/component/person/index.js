import React from 'react'
import Relay, { createContainer } from 'react-relay'

// Warning: RelayContainer: component `PersonComponent` was rendered with variables that differ from the variables used to fetch fragment `person`. 
// The fragment was fetched with variables `(not fetched)`, but rendered with variables `{}`. This can indicate one of two possibilities: 
//  - The parent set the correct variables in the query - `PersonComponent.getFragment('person', {...})` - but did not pass the same variables when rendering the component. 
//    Be sure to tell the component what variables to use by passing them as props: `<PersonComponent ...  />`.
//  - You are intentionally passing fake data to this component, in which case ignore this warning.

//a react component should map to a graphql objectType
const PersonComponent = props => {
    const {person: {name, age}} = props
    return (
        <div>
            <p>{name}</p>
            <p>{age}</p>
        </div>
    )
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
                id
            }`
    }
})