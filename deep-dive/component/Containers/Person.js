import React, { Component } from 'react'
import Relay from 'react-relay'
import PersonTemplate from '../Templates/PersonTemplate'

const getCountryCodeFromReduxConnect = () => {
    return 'au_redux'
}
class Person extends Component {

    componentWillMount() {
        const { relay } = this.props
        // it's worth mentioning that $status is passed from react-route and doesn't cause a re-fetch
        // it's only untill the NTG component is about to mount that it knows about the country filter
        const countryCode = getCountryCodeFromReduxConnect()
        relay.setVariables({
            countryCode
        })

    }

    componentWillReceiveProps(nextProps) {
  
    }


    render() {

        const { viewer:{person} } = this.props // should be const {person, countryCode} = this.props; but since we are not connecting to redux
        
        //******************************************************************************************
        const countryCode = this.props.relay.variables.countryCode; // should always be like this!!
        //******************************************************************************************

        return (
            <div>
                <PersonTemplate person={person} countryCode={countryCode} />
            </div>
        )
    }
}



Person = Relay.createContainer(Person, {
    initialVariables: {
        status: null, // react-router-relay -> app -> searchContainer -> Person ; no refetch
        countryCode: null // to be retrieved from country_filter which is only available when the component is about to mount (not static data)
    },
    fragments: {
        viewer: (variables) => Relay.QL`
            fragment on Viewer{
                person(status: $status, countryCode: $countryCode){
                    id,
                    ${PersonTemplate.getFragment('person', variables)}
              }
            } `
    }
})
export default Person
