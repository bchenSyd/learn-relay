import React, { Component, PropTypes } from 'react';
import Relay, { createContainer } from 'react-relay'
import StarWarsApp from './StarWarsApp'

const StarWarsLobby = ({viewer,relay}, context) => {
    const {factions} = viewer
    const printStore = ()=>{
        console.log(context.relay._storeData)
    }
    //i'm getting a fragment array here and I pass the array directly to StarWarsApp,
    //that's why in StarWarsApp, it needs to declare itself as @relay(plural:true)
    return (
        <div>
            <StarWarsApp factions={factions}/>
            <button style={{position:'absolute', top:'0', right:'0'}} 
                    onClick={printStore} >printStore</button>
        </div>
    );
};
StarWarsLobby.contextTypes = {
  relay: PropTypes.object
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