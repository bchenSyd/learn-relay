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

[source code](https://github.com/babel/babel/blob/7.0/packages/babel-cli/src/_babel-node.js#L9)
```
//babel-cli/_babel-node.js line 9
import register from "babel-register";  // this will call source-map-support.install()
```

note that [this line](https://github.com/babel/babel/blob/7.0/packages/babel-cli/src/_babel-node.js#L40) is not called;
it is only called when you run `babel-node` command (which we are not in `debug-mocha`;
```
register({
  extensions: program.extensions,
  ignore: program.ignore,
  only: program.only,
  plugins: program.plugins,
  presets: program.presets,
});
```