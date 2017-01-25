import React from 'react'
import Relay from 'react-relay'
import Person from './Containers/Person'

const default_status = 'in_progress'
let App = (props) => {
    return (
        <div id='app'>
            <Person {...props} 
                //bellow is the 'variable to render'
                status = {default_status} //**and**  you need to inform relay container ; otherwise, person is undefined! not a warning, a fatal error
             />
        </div>
    );
};

// 1. you have to forward fragment definition otherwise relay will complain
// 2. override child fragment variables

// To do this, we have to ensure that both the fragment and the container know about the custom variable.
// https://facebook.github.io/relay/docs/api-reference-relay-container.html#getfragment

App = Relay.createContainer(App, {
    fragments: {
        store: () => Relay.QL`
            fragment on Store{
                #you informed the fragment builder  //below is 'variable to fetch'
                ${Person.getFragment('store',{status:  default_status})} 
            } `
    }
})

export default App