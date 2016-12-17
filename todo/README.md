## graphql-relay
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


