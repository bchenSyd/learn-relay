export default `schema {
  query: Query
  mutation: Mutation
}

input Muation_Input {
  clientMutationId: String!
}

type Muation_Output {
  clientMutationId: String!
  viewer: Viewer
}

type Mutation {
  incrementCounter(input: Muation_Input): Muation_Output 
}

interface Node {
  id: ID!
}

type Person implements Node {
  id: ID!
  name: String
  age: Int
  status: String
  countryCode: String
}

type Query {
  node(id: ID!): Node
  viewer: Viewer
}

type Viewer {
  counter: Int
  person(countryCode: String = "default_country_code", status: String = "any"): Person
}
`