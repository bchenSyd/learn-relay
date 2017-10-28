import React, { Component } from 'react'
import Relay from 'react-relay/classic'
import PersonTemplate from '../Templates/PersonTemplate'

const getCountryCodeFromReduxConnect = () => {
    return 'au_redux'
}
class Person extends Component {

    componentDidMount() {
        const { relay } = this.props
        // it's worth mentioning that $status is passed from react-route and doesn't cause a re-fetch
        // it's only untill the NTG component is about to mount that it knows about the country filter
        const countryCode = getCountryCodeFromReduxConnect()
        relay.setVariables({
            countryCode
        })
    }

    componentWillReceiveProps(nextProps) {
        // https://github.com/facebook/relay/issues/1138
        // joseph savona's comment isn't correct. the variables are overriden by parent
        // [update] the overriding variables from parent doesn't necessarily contains all variables that child has. 
        // As along as parent passes something to child, all child's previous variables are lost and overridden
        // [todo:] how about we make a change to only reset child variables that parent has passed in?
        const { relay, relay: { variables: { status: existingStatus } } } = this.props;
        const { relay: { variables: { status: newStatus } } } = nextProps;
        if (existingStatus !== newStatus) { // user has select a different `status`; this will override the country code that it has
            const countryCode = getCountryCodeFromReduxConnect()
            relay.setVariables({
                countryCode
            })
        }

    }

    _isDataReady = () => {
        const { relay, relay: { variables: { countryCode } },
            relay: { pendingVariables } } = this.props;
        return !!countryCode && !pendingVariables;
        //console.log(` relay.varialbes is ${JSON.stringify(relay.variables)}. relay.pendingVariables is ${JSON.stringify(relay.pendingVariables)}`)
    }
    render() {

        const { viewer: { person }, relay} = this.props
        //******************************************************************************************
        const countryCode = relay.variables.countryCode; // should always be like this!!
        //******************************************************************************************
        return ( this._isDataReady() ? <div>
                <PersonTemplate person={person} countryCode={countryCode} />
            </div> : <div>loading...</div>
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
