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
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import { IndexRoute, Route, Router } from 'react-router';
import TodoApp from './components/TodoApp';
import TodoList from './components/TodoList';
import TodoDetails from './components/TodoDetails'


import { createHashHistory } from 'history';
import { applyRouterMiddleware, useRouterHistory } from 'react-router';
//if you want to use location.state, you must enable queryKey
//queryKey (?_k=6dzgsd) is the hash key for the location state object
const history = useRouterHistory(createHashHistory)({ queryKey: true });

const mountNode = document.getElementById('root');
import useRelay from 'react-router-relay';

const ViewerQueries = {
  viewer: () => Relay.QL`
        query { 
             viewer 
        }`,
};

const TodoQueries = {
  viewer: () => Relay.QL`
        query { 
             viewer 
        }`,
};
/*
above code is shor for:
const TodoQueries = {
  name_??: (component) => Relay.QL`
        query { 
             viewer {
                ${component.getFragment(name_??)}
             }
        }`,
};

 */


ReactDOM.render(
  <Router
    environment={Relay.Store}
    history={history}
    render={applyRouterMiddleware(useRelay)}>
    <Route path="/"
      component={TodoApp}
      queries={ViewerQueries}>
      <IndexRoute
        component={TodoList}
        queries={ViewerQueries}
        render={(props)=>{
            return 
        }}
        prepareParams={(params, routerProps) => {
          //here you can return the default route param
          return { status: 'any' }
        } }
        />
      <Route path=":status"
        component={TodoList}
        queries={ViewerQueries}
        prepareParams={(params, routerProps) => {
          return params
        } }
        />
      <Route path="/details/:todoId"
        component={TodoDetails}
        queries={TodoQueries}
        prepareParams={(params, routerProps) => {
          //auto sync
          //the route params returns here will 
          //1. become props to the component
          //2. if there is a relay query variables that has same property name, 
          //   the initial vaue of that vairable will be set from route param
          return {
               todId_variable: parseInt(params.todoId)
          }
        }}
        />
    </Route>
  </Router>,
  mountNode
);
