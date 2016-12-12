1. `babel-relay-plugin` transpiles graphql queries into IIFE expression. 
The IIFE returns a query descriptor which can be executed under ES5 syntax
Relay.QL`
{ person(id:1){
    name
}}`  ==> (function(){
  return {
      children: Array[1]
        0:object
           fieldName:'name'
           kind:'Field'
           metadata:object
                type:string
      metadata:object
        name:'Person'
        type:'Person'
  } //the take away is that, this query descriptor contains all MEMBERS and TYPES of the object being queried
 
 
  " Our transpiled query is now aware of all the types of all the fields in the query object.
    This gives relay much more power in what it can do with the query"  Samer buna


})();
To be able to transpile, `babel-replay-plugin` needs the **FULL JSON schema defination**
which is why `introspectionQuery` is required

the graphql query can be validate and transpiled using the schema.json file
becuase json contains the full schema definition (a bit like wsdl of webservice)