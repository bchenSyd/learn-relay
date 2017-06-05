
# debug mocha
1. package chain: `source-map-support` required; installed via `bbel-regitser` which is included via `babel-cli`
```
boche1@UNISYDWS065 MINGW64 /d/relay-todo-modern (master)
$ npm ls source-map-support
D:\relay-todo-modern
`-- babel-cli@6.24.1
  `-- babel-register@6.24.1
    `-- source-map-support@0.4.14
```

2. npm script
`"debug": "mocha --compilers js:babel-register --source-maps  --recursive \"js/**/*.spec.js\" --require test/setup.js --debug-brk --inspect"`

3. in `ES6` domain, `babel-register` call `source-map-support.install()` which is the key. this was revealled by [graphql-tools\test.ts](https://github.com/bochen2014/graphql-tools/blob/develop/src/test/tests.ts#L1); 
In typescript world, similarly, we have `ts-node/register` which does the same
[ts-node/register](https://github.com/bochen2014/graphql-tools/blob/develop/package.json#L23);

```
_sourceMapSupport2.default.install({
  handleUncaughtExceptions: false,
  environment: "node",
  retrieveSourceMap: function retrieveSourceMap(source) {
    var map = maps && maps[source];
    if (map) {
      return {
        url: null,
        map: map
      };
    } else {
      return null;
    }
  }
});
```
