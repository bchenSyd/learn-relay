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
import {IndexRoute, Route, Router} from 'react-router';
import TodoApp from './components/TodoApp';
import TodoList from './components/TodoList';


import {createHashHistory} from 'history';
import {applyRouterMiddleware, useRouterHistory} from 'react-router';
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
        prepareParams={(params, routerProps) => {
             //here you can return the default route param
             return {  status: 'any'}
        }}
      />
      <Route path=":status"
        component={TodoList}
        queries={ViewerQueries}
        prepareParams={(params, routerProps) => {
            //when  history.queryKey is on, you can refer to 
            //routerProps.location.state, which is an object
            console.log(routerProps.location.state)
            return params
        }}
      />
    </Route>
  </Router>,
  mountNode
);
