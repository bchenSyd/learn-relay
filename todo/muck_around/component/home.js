import React, {Component} from 'react'
import Relay from 'react-relay'


class Home extends Component {
    render(){
        console.log('test')
        const {store} = this.props
        return(
            <h1>{store.counter}</h1>
        )
    }
}

Home = Relay.createContainer(Home,{
    fragments:{
        store: ()=>Relay.QL`
            fragment on Store{
               #you can refer to counter here, but not person, 
               #if you want to refer to person, you need another fragment
               counter
            }`
    }
})
export default Home
