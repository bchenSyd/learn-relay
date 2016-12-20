import React, { Component } from 'react'
import { render } from 'react-dom'
import Relay from 'react-relay'

import LandingPage from './component/landingPage'
import About from './component/about'

class HomeRoute extends Relay.Route {
  static routeName = 'Home'
  static queries = {
    store1: (Component) => {
      /*IN SHORT, RELAY MAPS THE FRAGMENTREFERENCE THAT HAS THE SAME NAME AS ROOTQUERY TO THE FETCHED RESULT */

      // fragment is not a string. it's a RelayFragmentReference object
      // remember  taggedTemplate`template${para1}string` has signature defined as
      // taggedTemplate(string[], para1:any, para2:any)
      const fragment = Component.getFragment('store1')
      //transformedQuery1 has one child which is of type Object and is a query;
      // queryName : store1,  fragmentName declared in Landingpage : store1  => match
      // root query fragmentReference : null  => fail
      // the result won't have fetched data; but still have the raw __fragments__ which is the parsed inline query below
      const transformedQuery1 = Relay.QL` query{ 
        store{ 
          ... on Store{ 
            counter,
            person{
              name,
              age,
              id
            }
          }
        }}`

     //transformedQuery2 has one child which is of type RelayFragmentReference
      // queryName : store1,  fragmentName declared in Landingpage : store1  => match (if you rename fragment name in LandingPage to `store2`, it won't match)
      // root query fragmentReference : yes. the rootQuery contains a fragmentReference , although fagment name might be different
     // fragmentReferences with the same name is replaced with actual value. if fragment name is different, you get `null`, which has been proven
     // this is why we empharsize that rootquery can only contains one fragment and no field, the fragment name must be the same as root query name
      const transformedQuery2 = Relay.QL`query {
                store {
                    ${fragment}
                  }
            }`
     
     return transformedQuery2 // bchen: change it to transformedQuery1
    }
  }
}
// Bootstrap our root element for the app mountpoint
const root = document.createElement('div')
root.className = 'root'
document.body.appendChild(root)
const homeRoute = new HomeRoute()
render(<Relay.RootContainer
  Component={LandingPage} /* we pass <LandingPage /> Component to relay RootContainer */
  route={homeRoute} /* also specify a relay route for it*/   />, root)

//Query that works
/*
query {
      store {
          //${Component.getFragment('store1')} works
        }
  }
 */

//===============>  Queries supplied at the root should contains exactly one fragment and no fields.  <=============
//  ===========================> the one framgment should share the same name as root query name <==========================
//Query `Index` contains a field, `person`. If you need to fetch fields, declare them in a Relay container.
/*
query {
     store {
        person{
           name
        }
     }
 }
 */

// this query won't cause compile issues. However, there will be run time issues.
/* becuase we are using a inline fragement, when the result comes in, Relay won't be able to parse it 
{ store:{
  person:{
    id:'base64Str',
    name:'bchen'
    age:34
  }
}}
{store:{
    "__dataID__":"client:-20599818431","__fragments__":{"0::client":[{}]}}
}

 query {
       store {
           ... on Store{
             person{
               id
               name,
               age
             }
           }
         }
}
*/