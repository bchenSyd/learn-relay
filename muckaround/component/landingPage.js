import React, {Component} from 'react'
import Relay from 'react-relay'


class LandingPage extends Component {
    render(){
        console.log('test')
        const {store1:{ counter,person:{name}} } = this.props
        return(
            <div>
                <h1>{counter}</h1>
                <h1>{name}</h1>
            </div>
        )
    }
}

//one rootquery can only contains one fragment and no fields. the fragment and root query must share the same name
//the fragmentReference (returned by Relaycontainer.getFragment) will be replaced with the actual fetched data ONLY IF name matches
//so if you put fragment name to `store2`, at runtime, the value is `null`
LandingPage = Relay.createContainer(LandingPage,{
    fragments:{
        // you can call the fragement whatever you want, but the name you picked here must be 
        // consistent with the query name in homeRoute rootQuery name
        // bchen:change fragment name to `store2`
        store1: ()=>Relay.QL`
            fragment on Store{
               counter,
               person{
                   name,
                   age
               }
            }`
    }
})
export default LandingPage
