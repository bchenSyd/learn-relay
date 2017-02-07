import React, { Component } from 'react';
import Relay, { createContainer } from 'react-relay'
import { Link } from 'react-router'
import TodoList from './TodoList'
class TodoDetails extends Component {
    componentWillMount() {
        console.log(`******************* componentWillMount is Invoked!!!`)
    }

    render() {
        const {viewer, viewer: {
            todos: {
                edges
            }
        }, relay
        } = this.props

     
        const {node: {id, text, details}} = edges[0]
        return (
            <div>
                  <div style={{marginBottom:'100', borderBottom:'solid red 1px'}}>
                     <TodoList viewer={viewer} />
                </div>
                <div>
                    <Link to={`/`} >Home</Link>
                    <h1>details for {id}</h1>
                    <ul>
                        <li>text : {text}</li>
                        <li>details: {details}</li>
                    </ul>
                    <button onClick={() => {
                        relay.forceFetch()
                    }}> Force Fetch </button>
                </div>
               
            </div>
        );
    }


};

export default createContainer(TodoDetails, {
    initialVariables: {
        todId_variable: null,
    },

    prepareVariables(prevVariables) {
        return { ...prevVariables }
    },

    fragments: {
        viewer: () => Relay.QL`
            fragment on User{
               todos( id:$todId_variable , first: 1){
                   edges{
                       node{
                           id,
                           text,
                           details
                       }
                   }
               },
               ${TodoList.getFragment('viewer')}
            }`
    }
})