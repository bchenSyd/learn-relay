import React from 'react'
import { render } from 'react-dom'
import Relay, { Route } from 'react-relay/classic'
import App from './component/app'

class HomeRoute extends Route {
    static routeName = "MyRelayRoute";
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
        status:`any`
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


render(<Relay.Renderer
        environment={Relay.Store}
        forceFetch={false}
        Container={App}
        /* Relay promise to get data ready before render your component. So root query goes before render component tree */
        queryConfig={new HomeRoute({status:undefined})}
        render={({done, error, props, retry, state}) => {
            if (error) {
                return <h1>failed to execute the root query</h1>
            } else if (props) {
                return <App {...props} />
            } else {
                return <h1>waiting response for the viwer query....</h1>
            }
        } }
    />, root)

