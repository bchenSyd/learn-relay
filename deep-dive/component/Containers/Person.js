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
        // https://github.com/facebook/relay/issues/1138
        // joseph savona's comment isn't correct. the variables are overriden by parent
        // todo: if status
    }


    render() {

        const { viewer, viewer:{person}, relay } = this.props // should be const {person, countryCode} = this.props; but since we are not connecting to redux
        
        //******************************************************************************************
        const countryCode = relay.variables.countryCode; // should always be like this!!
        //******************************************************************************************
        //console.log(`pending trx: ${JSON.stringify(relay.getPendingTransactions(viewer))}`)
        console.log(` relay.varialbes is ${JSON.stringify(relay.variables)}. relay.pendingVariables is ${JSON.stringify(relay.pendingVariables)}`)
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
