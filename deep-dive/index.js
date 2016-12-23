import React from 'react'
import { render } from 'react-dom'
import Relay, { Route } from 'react-relay'
import LandingPage from './component/landingPage'

class HomeRoute extends Route {
    static routeName = "MyRelayRoute";

    static paramDefinitions={
        storeId:{ required: true}
    }
    static queries = {
        // if you 
        //          1. don't pass any parameter in below queryconfig, 
        //          2. don't specify subfields of your root query field
        // relay will automatically use the one RootContainer defines becuase it konws the rule 
        // **********************   Queries supplied at the root should contain exactly one fragment and no fields  *********************
        // so it would have the same effect as you would explicitly call component.getFragment('store1')
        store: () => Relay.QL`query{  store(id: $storeId)  }`   
    }
}


const root = document.createElement('div')
root.className = 'root'
document.body.appendChild(root)

//I prefer this way as it's more aligned with ReactDOM
//Relay.Renderer is mimicking ReactDOM.render method
render(<Relay.Renderer
    environment={Relay.Store}
    forceFetch={false}
    Container={LandingPage}  /* Relay will attempt to fulfill its data requirements before rendering it. */
    queryConfig={new HomeRoute({storeId:'688'})}  /* Relay promise to get data ready before render your react component. So root query goes first! */
    render={({done, error, props, retry, state}) => {
        if (error) {
            return <h1>failed to execute the root query</h1>
        } else if (props) {
            // the luxury of specifying properties of your Root React Component is provided by Relay.Renderer
            /*
                Even though we have access to the data object in renderFetched, the actual data is intentionally opaque. 
                This prevents the renderFetched from creating an implicit dependency on the fragments declared by Component.
             */
            return <LandingPage {...props} />
        } else {
            return <h1>waiting response for the root query....</h1>
        }
    } }
    />, root)

