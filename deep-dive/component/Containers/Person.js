import React, { Component } from 'react'
import Relay from 'react-relay/classic'
import PersonTemplate from '../Templates/PersonTemplate'


class Person extends Component {
    render() {
        const { viewer: { person }, relay } = this.props
        return <div>
            <PersonTemplate person={person} />
        </div>
    }
}


Person = Relay.createContainer(Person, {
    initialVariables: {
        status: null, // react-router-relay -> app -> searchContainer -> Person ; no refetch
    },
    fragments: {
        viewer: (variables) => Relay.QL`
            fragment on Viewer{
                person(status: $status){
                    id,
                    name,
                    age,
                    status,
                    countryCode
              }
            } `
    }
})
export default Person
