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
    //Relay.Route   constructor(initialParams)
    route={new StarWarsAppHomeRoute({
      //************************************************************ */
      //   the initialparams defined here will automatically be passed down
      //   to the top-level container and can be used there if needed
            factionNames: ['empire', 'rebels'],   
      //************************************************************ */
    })}
  />,
  document.getElementById('root')
);
