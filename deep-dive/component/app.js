import React from 'react'
import Relay from 'react-relay'
import Person from './Containers/Person'

let App = (props) => {
    return (
        <div id='app'>
            <Person {...props}/>
        </div>
    );
};

//you have to forward fragment definition otherwise relay will complain
App = Relay.createContainer(App, {
    fragments: {
        store: () => Relay.QL`
            fragment on Store{
                ${Person.getFragment('store')}
            } `
    }
})

export default App