import React from 'react'
import { render } from 'react-dom'
import Relay, { Route } from 'react-relay'
import LandingPage from './component/landingPage'

class HomeRoute extends Route {
    static routeName = "MyRelayRoute";
    
    static queries = {
        // if you 
        //          1. don't pass any parameter in below queryconfig, 
        //          2. don't specify subfields of your root query field
        // relay will automatically use the one RootContainer defines becuase it konws the rule 
        // **********************   Queries supplied at the root should contain exactly one fragment and no fields  *********************
        // so it would have the same effect as you would explicitly call component.getFragment('store1')
        store1: () => Relay.QL`query{  store1:store  }`
    }
}

const root = document.createElement('div')
root.className = 'root'
document.body.appendChild(root)


render(<Relay.Renderer
    environment={Relay.Store}
    forceFetch={false}
    Container={LandingPage}  /* Relay will attempt to fulfill its data requirements before rendering it. */
    queryConfig={new HomeRoute()}
    render={  ( {done, error, props, retry, state} ) => {
        if(error){
            return <h1>failed to execute the root query</h1>
        } else if(props){
            return <LandingPage {...props} />
        } else{
            return <h1>waiting response for the root query....</h1>
        }
    }} 
    />,root)