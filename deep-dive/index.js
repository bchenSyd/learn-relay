import React from 'react'
import { render } from 'react-dom'
import Relay, { Route } from 'react-relay'
import App from './component/app'

class HomeRoute extends Route {
    static routeName = "MyRelayRoute";

    /*
    Routes can declare a set of parameter names that it requires to be supplied to the constructor. 
    This is also a convenient place to document the set of valid parameters.
    */
    static paramDefinitions= {
        status:{ required: true}  
    }

    /*
    similiar to prepareVarialbes in RelayContainer;
    note that 
    1.     all route params are passed to Component as props
    2. (!) relay will automatically sync route params with component query variables if they have the same name!
           this is the inspiration for anil to sync normal props with query variables in Unibet's verison of relay container
    */
    static prepareParams = previousParams => ({
        //do the inital transform; set defualt param ...etc
        status:`passed` //=======================================================================> this will be passed to the Route Component as a prop
    })
    static queries = {
        // **********************   Queries supplied at the root should contain exactly one fragment and no fields  *********************
        /* short for 
        name_?? : (component)=>Relay.QL`
                            viewer{
                                ${component.getFragment('name_??')}
                            }
                    ` */
        viewer: () => Relay.QL`query{  viewer }`
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
    Container={App}  /* Relay will attempt to fulfill its data requirements before rendering it. */
    queryConfig={new HomeRoute({status:undefined})}  /* Relay promise to get data ready before render your react component. So root query goes first! */
    render={({done, error, props, retry, state}) => {
        if (error) {
            return <h1>failed to execute the root query</h1>
        } else if (props) {
            // the luxury of specifying properties of your Root React Component is provided by Relay.Renderer
            /*
                Even though we have access to the data object in renderFetched, the actual data is intentionally opaque. 
                This prevents the renderFetched from creating an implicit dependency on the fragments declared by Component.
             */
            return <App {...props} />
        } else {
            return <h1>waiting response for the root query....</h1>
        }
    } }
    />, root)

