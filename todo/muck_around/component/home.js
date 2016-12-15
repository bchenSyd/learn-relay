import React, {Component} from 'react'
import Relay from 'react-relay'


class Home extends Component {
    render(){
        console.log('test')
        const {store:{ counter,person:{name}} } = this.props
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
        store: ()=>Relay.QL`
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
