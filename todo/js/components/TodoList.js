import MarkAllTodosMutation from '../mutations/MarkAllTodosMutation';
import Todo from './Todo';

import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router'


class TodoList extends React.Component {
  _handleMarkAllChange = (e) => {
    const complete = e.target.checked;
    this.props.relay.commitUpdate(
      new MarkAllTodosMutation({
        complete,
        todos: this.props.viewer.todos,
        viewer: this.props.viewer,
      })
    );
  };
  renderTodos() {
    return this.props.viewer.todos.edges.map(edge =>
      <Todo
        key={edge.node.id}
        todo={edge.node}
        viewer={this.props.viewer}
      />
    );
  }
  render() {
    const numTodos = this.props.viewer.totalCount;
    const numCompletedTodos = this.props.viewer.completedCount;
    return (
      <section className="main">
        <input
          checked={numTodos === numCompletedTodos}
          className="toggle-all"
          onChange={this._handleMarkAllChange}
          type="checkbox"
        />
        <label htmlFor="toggle-all">
          Mark all as complete
        </label>
        <ul className="todo-list">
          {this.renderTodos()}
        </ul>
      </section>
    );
  }
}

export default Relay.createContainer(TodoList, {
  initialVariables: {
    status: null,
  },

  prepareVariables({status}) {
    let nextStatus;
    if (status === 'active' || status === 'completed') {
      nextStatus = status;
    } else {
      // This matches the Backbone example, which displays all todos on an
      // invalid route.
      nextStatus = 'any';
    }
    return {
      status: nextStatus,
    };
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        completedCount,
        todos(
          status: $status,
          first: 2147483647  # max GraphQLInt
        ) {
          edges {
            node {
              id,
              summary,
              #carousel , only fetch the top 4; and contains eventId and suspended
              #the rest competitors fetched in FKEventTemplate get merged and stored in the eventId
              #when navi back, relay found that eventId and suspended are missing for the newly fetched competitors
              competitors{
                id,
                name,
                saddleNumber,
                eventId,
                suspended
              }
              ${Todo.getFragment('todo')},
            },
          },
          ${MarkAllTodosMutation.getFragment('todos')},
        },
        totalCount,
        ${MarkAllTodosMutation.getFragment('viewer')},
        ${Todo.getFragment('viewer')},
      }
    `,
  },
})

