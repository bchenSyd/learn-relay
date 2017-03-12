import React, { Component } from 'react';
import Relay, { createContainer } from 'react-relay'
import { Link } from 'react-router'
import TodoList from './TodoList'
class TodoDetails extends Component {
  render() {
        const { viewer, viewer: {
            todos: {
                edges
            }
        }, relay
        } = this.props


        const { node: { id, text, details, competitors } } = edges[0]
        return (
            <div>
                {false && <div style={{ marginBottom: '100px', borderBottom: 'solid red 1px' }}>
                    <TodoList viewer={viewer} />
                </div>
                }
                <div>
                    <Link to={`/`} >Home</Link>
                    <h1>details for {id}</h1>
                    <ul>
                        <li>text : {text}</li>
                        <li>details: {details}</li>
                    </ul>
                    <h1>competitors -- here we fetch **all** competitors (carousel only fetch top 4)</h1>
                    <ul>
                        {competitors.map((val, index) =>
                            <li key={`competitory_${index}`}>
                                <div>id : <stong>{val.id}</stong></div>
                                <div>name : <strong>{val.name}</strong></div>
                                <div>saddleNumber : <strong>{val.saddleNumber}</strong></div>
                            </li>
                        )}
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
                           details,
                           #inside FKEventTemplate, we fetch the rest competitors, without eventId and suspended
                           competitors{
                               id,
                               name,
                               saddleNumber
                           }
                       }
                   }
               },
               ${TodoList.getFragment('viewer')}
            }`
    }
})