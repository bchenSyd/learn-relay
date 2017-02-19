'use strict';

import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  createShip,
  getFaction,
  getFactions,
  getShip,
  getShips,
} from './database';

const fromGlobalId_unibet = (globalId)=>{
    const [type, id] = globalId.split(':')
    return {
      type,id
    }
}
const toGlobalId_unitbet = (typeStr,id)=> [typeStr,id].join(':')

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId_unibet(globalId);
    if (type === 'Faction') {
      return getFaction(id);
    } else if (type === 'Ship') {
      return getShip(id);
    } else {
      return null;
    }
  },
  (obj) => {
    return obj.ships ? factionType : shipType;
  }
);


const shipType = new GraphQLObjectType({
  name: 'Ship',
  description: 'A ship in the Star Wars saga',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),   //note: you MUST use  GraphQLID, not ANYTHINGELSE!
      resolve: obj => toGlobalId_unitbet('Ship', obj.id)
    },
    name: {
      type: GraphQLString,
      description: 'The name of the ship.',
    },
  }),
  interfaces: [nodeInterface],
});

const {
  connectionType: shipConnection,
  edgeType: ShipEdge,
} = connectionDefinitions({ name: 'Ship', nodeType: shipType });


const factionType = new GraphQLObjectType({
  name: 'Faction',
  description: 'A faction in the Star Wars saga',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),   //note: you MUST use  GraphQLID, not ANYTHINGELSE!
      resolve: obj => toGlobalId_unitbet('Faction', obj.id)
    },
    factionId: {
      type: GraphQLString,
      description: 'id of faction in db',
      resolve: (faction) => faction.id,
    },
    name: {
      type: GraphQLString,
      description: 'The name of the faction.',
    },
    ships: {
      type: shipConnection,
      description: 'The ships used by the faction.',
      args: connectionArgs,
      resolve: (faction, args) => connectionFromArray(
        faction.ships.map((id) => getShip(id)),
        args
      ),
    },
  }),
  interfaces: [nodeInterface],
});

// a viewer is normally mapped to a logged in user
const viewer = [{ name: 'bchen' }, { name: 'joanna' }]
const getViewer = () => {
  return viewer[0]
}

const ViewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    factions: {
      type: new GraphQLList(factionType),
      args: {
        names: {
          type: new GraphQLList(GraphQLString),
        },
      },
      resolve: (root, {names}) => getFactions(names)
    }
  }),
});

//root query 
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField, //root query must declare node field so that Relay can send node queries
    viewer: {
      type: ViewerType,
      resolve: () => {
        return getViewer()
      }
    }
  }),
});

const shipMutation = mutationWithClientMutationId({
  name: 'IntroduceShip',
  inputFields: {
    shipName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    factionId: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  outputFields: {
    newShipEdge: {
      type: ShipEdge,
      resolve: (payload) => {
        const ship = getShip(payload.shipId);
        return {
          cursor: cursorForObjectInConnection(
            getShips(payload.factionId),
            ship
          ),
          node: ship,
        };
      },
    },
    faction: {
      type: factionType,
      resolve: (payload) => getFaction(payload.factionId),
    },
  },
  mutateAndGetPayload: ({shipName, factionId}) => {
    const newShip = createShip(shipName, factionId);
    return {
      shipId: newShip.id,
      factionId: factionId,
    };
  },
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 *
 * This implements the following type system shorthand:
 *   type Mutation {
 *     introduceShip(input: IntroduceShipInput!): IntroduceShipPayload
 *   }
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    introduceShip: shipMutation,
  }),
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
