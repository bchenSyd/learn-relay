import React from 'react';
import Relay, {createContainer} from 'react-relay'


const TodoDetails = props => {

    const {todo} = props
    console.log(todo)
    const {id, text, details} = todo
    return (
        <div>
            <h1>details for {id}</h1>
            <ul>
                <li>text : {text}</li>
                <li>details: {details}</li>
            </ul>

        </div>
    );
};

export default  createContainer(TodoDetails,{
    initialVariables: {
        todId_variable: null,
  },

  prepareVariables(prevVariables) {
      return {...prevVariables}
  },
    fragments:{
        todo: ()=> Relay.QL`
            fragment on User{
               todos( id:$todId_variable , first: 1){
                   edges{
                       node{
                           id,
                           text,
                           details
                       }
                   }
               }
            }`
    }
})