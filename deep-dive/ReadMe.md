
#launch from vs code 
```
node --inspect=9229 --debug-brk babel-node.js d:\__work\learn-relay\real-world/server.js 
Debugger listening on port 9229.
Warning: This is an experimental feature and could change at any time.
d:\__work\learn-relay\real-world\node_modules\babel-core\lib\transformation\file\options\option-manager.js:327
        throw e;
        ^

Error: Options {"loose":true} passed to d:\__work\learn-relay\real-world\node_modules\babel-preset-es2015\lib\index.js which does not accept options. (While processing preset: "d:\\__work\\learn-relay\\real-world\\node_modules\\babel-preset-es2015\\lib\\index.js") (While processing preset: "d:\\__work\\learn-relay\\real-world\\node_modules\\babel-preset-es2015\\lib\\index.js") (While processing preset: "d:\\__work\\learn-relay\\real-world\\node_modules\\babel-preset-react\\lib\\index.js")
    at d:\__work\learn-relay\real-world\node_modules\babel-core\lib\transformation\file\options\option-manager.js:313:17
    at Array.map (native)
    at OptionManager.resolvePresets (d:\__work\learn-relay\real-world\node_modules\babel-core\lib\transformation\file\options\option-manager.js:274:20)
    at OptionManager.mergePresets (d:\__work\learn-relay\real-world\node_modules\babel-core\lib\transformation\file\options\option-manager.js:263:10)
    at OptionManager.mergeOptions (d:\__work\learn-relay\real-world\node_modules\babel-core\lib\transformation\file\options\option-manager.js:248:14)
    at OptionManager.init (d:\__work\learn-relay\real-world\node_modules\babel-core\lib\transformation\file\options\option-manager.js:367:12)
    at compile (d:\__work\learn-relay\real-world\node_modules\babel-register\lib\node.js:103:45)
    at loader (d:\__work\learn-relay\real-world\node_modules\babel-register\lib\node.js:144:14)
    at Object.require.extensions.(anonymous function) [as .js] (d:\__work\learn-relay\real-world\node_modules\babel-register\lib\node.js:154:7)
    at Module.load (module.js:487:32)
Debugger attached.
Waiting for the debugger to disconnect...
```

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

2. you can refer to fields within edge-node pattern,  but you can't with a node(id) query
```
{ 
  viewer{
    todos{
      edges{
        node {
          id,
          text   #you can refer to Todo.text without casting node to Todo ;
                 #this is becuase GraphQL is strong typed language can it can infer the type of node by the syntax
        }
      }
    }
  }
  }
```

you can't refer to fields other than id and __typename (both defined at node level, namely idFetcher and type_resolver), becuase
graphQL doesn't have enought information to infer the node type (can only be determined at run time);
```
{node(id:"VG9kbzow"){
  id,
  __typename,  #this can only be determined at runtime by NodeInterface.typeResolver;
  text  # you get an error here becuase node#"VG9kbzow" could be anything; there isn't enough syntax for graphQL to infer the type of the Node
}}
```
you can cast the node to a concrete graphQL type, if you cast is invalid, graphql won't throw error but return empty
in below example, node#"VG9kbzow" is of type `todo`, so the first query will return correct data;
in the second query, we are trying to cast the node to a `User` object, which is no a valid cast
```
{node(id:"VG9kbzow"){		       		|							{node(id:"VG9kbzow"){
  id,								              |								 id,
  __typename,					          	|								 __typename,
  ... on Todo{					        	|								  ... on User{
     text							            |									 totalCount
  }									              |							  }
}}								              	|							}}

------------------------------  result ------------------------------
{			                       	    |		{
  "data": {			                  |		  "data": {
    "node": {						          |		    "node": {
      "id": "VG9kbzow",			      |		      "id": "VG9kbzow",
      "__typename": "Todo",		  	|		      "__typename": "Todo"
      "text": "Taste JavaScript"	|		      #empty....
    }							              	|		     }
  }								              	|		   }
}							                    |   }

```

git push origin HEAD
    A handy way to push the current branch to the same name on the remote.