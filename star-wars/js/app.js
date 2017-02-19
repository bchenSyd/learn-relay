import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import StarWarsLobby from './components/StarWarsLobby';


class StarWarsAppHomeRoute extends Relay.Route {
  static routeName = 'StarWarsAppHomeRoute'
  static paramDefinitions = {
    factionNames: { required: true }
  }
  static prepareParams = prevVars => {
    return prevVars
  }
  static queries = {
    viewer: () => Relay.QL`query {
           viewer
      }`,
    /*short for
      viewer_??: component => Relay.QL`query {
         viewer{
           ${component.getFragment('viewer_??')}
         }
      }`*/
  };

}


ReactDOM.render(
  <Relay.RootContainer
    Component={StarWarsLobby}
    route={new StarWarsAppHomeRoute({
      // don't define initial param here anymore;
      factionNames: ['empire', 'rebels']
    })}
  />,
  document.getElementById('root')
);
