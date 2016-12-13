import React, {Component} from 'react'
import Relay from 'react-relay'


class Home extends Component {
    render(){
        const {store} = this.props
        return(
            <h1>{counter}</h1>
        )
    }
}

Home = Relay.createContainer(Home,{
    fragments:{
        dummy: Relay.QL`
        fragment on Store{
            counter,
            person{
                name
            }
        }`
    }
})
export default Home
