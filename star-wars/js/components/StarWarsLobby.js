import React, { Component } from 'react';
import Relay, { createContainer } from 'react-relay'
import StarWarsApp from './StarWarsApp'

const StarWarsLobby = ({viewer}) => {
    const {factions} = viewer
    //i'm getting a fragment array here and I pass the array directly to StarWarsApp,
    //that's why in StarWarsApp, it needs to declare itself as @relay(plural:true)
    return (
        <div>
            <StarWarsApp factions={factions}/>
        </div>
    );
};


export default createContainer(StarWarsLobby, {
    initialVariables: {
        factionNames:null
    },
    fragments: {
        viewer: () => Relay.QL`
         fragment on Viewer{
             factions(names:$factionNames){
                 ${StarWarsApp.getFragment('factions')}
             }
         } 
       `
    }
});