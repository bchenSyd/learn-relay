import React, { Component } from 'react'
import Relay, { createContainer } from 'react-relay'
import DatePicker from 'antd/lib/date-picker';
import 'antd/lib/date-picker/style';
//import '../../styles/date-picker.less';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

// Warning: RelayContainer: component `PersonTemplate` was rendered with variables that differ from the variables used to fetch fragment `person`. 
// The fragment was fetched with variables `(not fetched)`, but rendered with variables `{}`. This can indicate one of two possibilities: 
//  - The parent set the correct variables in the query - `PersonTemplate.getFragment('person', {...})` - but did not pass the same variables when rendering the component. 
//    Be sure to tell the component what variables to use by passing them as props: `<PersonTemplate ...  />`.
//  - You are intentionally passing fake data to this component, in which case ignore this warning.

//a react component should map to a graphql objectType
const PersonTemplate = props => {
    const { person: { name, age, status, countryCode } } = props
    return (
        <div>
            <div id='search_result'>
                <div style={{ marginTop: 10 }}>
                    <span>name  --  </span>
                    <span>{name}</span>
                </div>
                <div style={{ marginTop: 10 }}>
                    <span>age  --  </span>
                    <span>{age}</span>
                </div>
                <div style={{ marginTop: 10 }}>
                    <span>status  --  </span>
                    <span>{status}</span>
                </div>
                <div style={{ marginTop: 10 }}>
                    <span>countrycode (redux) --  </span>
                    <span>{countryCode}</span>
                </div>
            </div>

            <div>
                <LocaleProvider locale={enUS}>
                    <DatePicker />
                </LocaleProvider>
            </div>
        </div>
    )
}



export default createContainer(PersonTemplate, {
    initialVariables: {
        countryCode: null // to be passed from frankel/person
    },
    fragments: {
        person: () => Relay.QL`
            fragment on Person{
                name,
                age,
                status,
                id, 
                countryCode
            }`
    }
})