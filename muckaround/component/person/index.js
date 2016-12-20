import React from 'react'
import Relay, { createContainer } from 'react-relay'

//a react component should map to a graphql objectType
const PersonComponent = props => {
    const {person: {name, age, id}} = props
    return (
        <div>
            <p>{id}</p>
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