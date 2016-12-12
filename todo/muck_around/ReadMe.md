1. `babel-relay-plugin` transpiles graphql queries into EFFI expression. 
The EFII returns a query descriptor which can be executed under ES5 syntax
Relay.QL`
{ person(id:1){
    name
}}`
To be able to transpile, `babel-replay-plugin` needs the **FULL JSON schema defination**
which is why `introspectionQuery` is required