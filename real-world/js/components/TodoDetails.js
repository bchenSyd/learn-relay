import React from 'react';
import Relay, { createContainer } from 'react-relay'
import {Link} from 'react-router'

const TodoDetails = props => {
    
    const {todo: {
            todos: {
                edges
            }
        }
    } = props

    const {node:{id, text, details}} = edges[0]
    return (
        <div>
            <Link to={`/`} >Home</Link>
            <h1>details for {id}</h1>
            <ul>
                <li>text : {text}</li>
                <li>details: {details}</li>
            </ul>

        </div>
    );
};

export default createContainer(TodoDetails, {
    initialVariables: {
        todId_variable: null,
    },

    prepareVariables(prevVariables) {
        return { ...prevVariables }
    },
    
    fragments: {
        todo: () => Relay.QL`
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