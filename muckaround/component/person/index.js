import React from 'react'
import Relay,{ createContainer} from 'react-relay'

//a react component should map to a graphql objectType
const PersonComponent = props => {
    const {person:{name,age,id}} = props
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
        person: ()=>Relay.QL`
        fragment on Person{
            name,
            age,
            id
        }`
    }
})