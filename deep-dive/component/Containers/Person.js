import React, { Component } from 'react'
import Relay from 'react-relay/classic'
import PersonTemplate from '../Templates/PersonTemplate'


class Person extends Component {
    _isDataReady = () => {
        const { relay: { variables: { status }, pendingVariables } } = this.props;
        // relay.variables.status always equals to props.status
        // pendingVariables null
        // this approach doesn't work
        // on top of that, you get `rendered with variables that differ from the variables used to fetch fragment viewer`
        return  !pendingVariables;
    }
    render() {
        const { viewer: { person }, relay } = this.props
        return (this._isDataReady() ? <div>
            <PersonTemplate person={person} />
        </div> : <div>loading...</div>
        )
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
