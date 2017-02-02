## graphql-relay
* nodeInterface
```
{ viewer{
   todos{
    edges {
      node {
        id
      }
    }
  }
}}  =>

{
  "data": {
    "viewer": {
      "todos": {
        "edges": [
          {
            "node": {
              "id": "VG9kbzow"
            }
          },
          {
            "node": {
              "id": "VG9kbzox"
            }
          }
          ]
          }
        }
      }
    }
-------------

{
  node(id:"VG9kbzo1"){
     id,
     __typename,
    ... on Todo{
      id,
      complete,
      text
    }
  }
}==>
{
  "data": {
    "node": {
      "id": "VG9kbzo1",
      "__typename": "Todo",
      "complete": true,
      "text": "sign contract with unibet"
    }
  }
}

```
* connection

```
{viewer{
    todos (first: 2){ //this is the connection, it's important to notice that a connect is essentially a list<GraphQLObjectType>
      customField,
      edges{
        node{
          id,
          
          text
        }
      },
      pageInfo{
         hasNextPage
      }
    }
}}
--------->
{
  "data": {
    "viewer": {
      "todos": { // the `selector` here, e.g. first/ last /before/ after..etc , determines length of edges
        "customField": "custom",
        "edges": [  // the length of `edges` is determined by selector in the connection 
          {
            "node": {
              "id": "VG9kbzow",
              "text": "Taste JavaScript"
            }
          },
          {
            "node": {
              "id": "VG9kbzox",
              "text": "Buy a unicorn"
            }
          }
        ],
        "pageInfo": {
          "hasNextPage": false
        }
      }
    }

  }
}
```


## GraphQL Type System
```
{

  MutationType:__type(name:"Mutation"){
  fields{
    name
  }
  },

  queryType:__type(name:"Query"){
  fields{
    name
  }
  }

}
```
//server.js
import express from 'express'
import graphQLHTTP from 'express-grahql'
import DataLoader from 'dataloader'

import schema from './schema'

//hoist getPerson up
const python_django_person_rest_url = 'http://localhost:5000/person/'
function GetPersonById(id){
    return fetch(`${python_django_person_rest_url}${id}`)
}
const app = express()
app.user(graphQLHTTP(res =>{
    const personaLoader = new DataLoader(
        keys => Promise.all(keys.map(getPersonById))
    )
    const loaders = {
        person: personLoader
    }
    return {
    context: {loaders}
    schema,
    graphiQL: true
    }))
// app.user(graphQLHTTP({
//     schema,
//     graphiQL: true}))    
app.listen(5000)


//schema.js
import {
    GraphQLLSchema
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} from 'graphql'


//hoist getPerson up
const python_django_person_rest_url = 'http://localhost:5000/person/'
function GetPersonById(id){
    return fetch(`${python_django_person_rest_url}${id}`)
}

const PersonType = new GraphQLObjectType({
    name:'Person',
    descriptioin:'...',

    fields:()=>({
        firstName: {
            type :GraphQLString,
            resolve: (obj) => obj.first_name // map camelcase with underscore in django
        },
        id : {type: GraphQLString},
        friends:{
            type: new GraphQLList(PersonType),
            resolve: (obj, args, {loader}) => 
                loaders.person.loadMany(obj.firends) //use dataloader
                //obj.friends.map(GetPersonById)
        }
    })
})



const QueryType = new GraphQLObjectType({
    name:'Query',
    descriptioin: '...',

    fields : ()=>({
        person: {
            type: PersonType,
            args:{
                id:{type: GraphQLString} 
            },
            resolve:(root, args, {loaders}) => 
               loaders.person.load(args.id) //use dataloader;
               //GetPersonById(args.id) //GetPersonById is a promise, 'this is HUGE! this opens a new world of asychronize goodies'
        }
    })
})

export default new GraphQLLSchema({
    query: QueryType
})


query you_must_give_a_name_to_satisfy_relay{
    person(id:"1"){
        firstName
        lastName
        email
        username
        friends{
            firstName,
            email
        }
    }
}

===>

{
    data:{
        person:{
            firstName: 'bo'
            lastName:'chen',
            email:'bochen2014@yahoo.com',
            username:'bochen2014',
            firends:[
                {   firstName:'chris'
                    email:'chris@gmail.com'
                },
                {
                    firstName:'rowen',
                    email:'rowen@gmail.com
                }
            ]
        }
    }
}


## typescript
the [graphql type declaration](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/types-2.0/graphql/index.d.ts ) 
is still using old syntax, i.e. defined as global modlue rather than an external module