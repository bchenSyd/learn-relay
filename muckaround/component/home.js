import React, {Component} from 'react'
import Relay from 'react-relay'


class Home extends Component {
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

Home = Relay.createContainer(Home,{
    fragments:{
        /// you can call the fragement whatever you want, but the name you picked here must be 
        /// consistent with the query name in homeRoute rootQuery name 
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
export default Home
