import React, { Component } from 'react'
import { render } from 'react-dom'
import Relay from 'react-relay'

import Home from './component/home'
import About from './component/about'

class HomeRoute extends Relay.Route {
  static routeName = 'Home'
  static queries = {
    store1: (Component) => Relay.QL`
            query {
                store {
                  ${Component.getFragment('store')}
                }
            }`

  }
}


// Bootstrap our root element for the app mountpoint
const root = document.createElement('div')
root.className = 'root'
document.body.appendChild(root)
const homeRoute = new HomeRoute()
render(<Relay.RootContainer
  Component={Home}
  route={homeRoute} />, root)



/*
query myQuery{
    store{
      person{
        ...myView
      }
    }
}

fragment myView on Person{
  name,
  age
}

==>
{
  "data": {
    "store": {
      "person": {
        "name": "bo chen",
        "age": 34
      }
    }
  }
}

 */