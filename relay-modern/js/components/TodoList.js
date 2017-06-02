/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * @flow
 */

import MarkAllTodosMutation from '../mutations/MarkAllTodosMutation';
import Todo from './Todo';
import Todo2 from './Todo2';

import React from 'react';
import {
  createRefetchContainer,
  graphql,
} from 'react-relay';

class TodoList extends React.Component<any, any, any> {
  hidden: Object = {};
  _handleMarkAllChange = (e) => {
    const complete = e.target.checked;
    MarkAllTodosMutation.commit(
      this.props.relay.environment,
      complete,
      this.props.viewer.todos,
      this.props.viewer,
    );
  };
  renderTodos() {
    const isNormalView = (!this.hidden.dataset /*initial render*/) || this.hidden.dataset.isnormalview === 'true' /* user switched back*/;
    return this.props.viewer.todos.edges.map(edge => {
      return isNormalView ? <Todo
        key={edge.node.id}
        todo={edge.node}
        viewer={this.props.viewer}
      /> :
        <Todo2
          key={edge.node.id}
          todo={edge.node}
          viewer={this.props.viewer}
        />
    });
  }
  _onSwitchView = e => {
    // i'm using ref becuase 
    // 1. can't change props  2. set state will cause a re-render which I don't want
    const currentRefState = this.hidden.dataset.isnormalview;
    const isNormalView: boolean = currentRefState === 'true';
    this.props.relay.refetch({ isNormalView: !isNormalView }, null, () => {
      // relay will first execute refetch callback, then call setState internally;
      // so your callback is executed before the resulting re-render
      this.hidden.dataset.isnormalview = (!isNormalView).toString();
      console.log(`refetch is down with isNormalView = ${(!isNormalView).toString()}`);
    })

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
        <div>
          <button onClick={this._onSwitchView}>Switch View</button>
          {/*  the callback will be executed immediately after the component is mounted or unmounted  */}
          <input type="hidden" data-isnormalview="true" ref={ref => this.hidden = ref} />
        </div>
      </section>
    );
  }
}

export default createRefetchContainer(TodoList,
  graphql.experimental`
    fragment TodoList_viewer on User
        @argumentDefinitions( 
          isNormalView:{
            type:"Boolean!",
            defaultValue:true
           }
        )
          {
          todos(
            first: 2147483647  # max GraphQLInt
          ) @connection(key: "TodoList_todos") {
            edges {
              node {
                id,
                complete,
                ...Todo_todo  @include(if: $isNormalView),
                ...Todo2_todo @skip(if: $isNormalView),
              },
            },
          },
          id,
          totalCount,
          completedCount,
          ...Todo_viewer,
        }
  `,
  graphql.experimental`
  query TodoListViewRefetchQuery($isNormalView: Boolean!){
    viewer{
      user{
           ...TodoList_viewer @arguments(isNormalView: $isNormalView) 
        }
      }
  }`
);
