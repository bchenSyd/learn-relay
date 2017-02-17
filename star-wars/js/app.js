import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import StarWarsApp from './components/StarWarsApp';


class StarWarsAppHomeRoute extends Relay.Route {
  static queries = {
    factions: () => Relay.QL`query {
           factions(names: $factionNames)
      }`,
    /*
      factions_??: component => Relay.QL`query {
         factions(names: $factionNames)
          ${component.getFragment('factions_??')}
      }`*/
  };
  static routeName = 'StarWarsAppHomeRoute';
}


ReactDOM.render(
  <Relay.RootContainer
    Component={StarWarsApp}
    route={new StarWarsAppHomeRoute({
            factionNames: ['empire', 'rebels'],   //this is an example of passing parameters from route  to component
    })}
  />,
  document.getElementById('root')
);
