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

# debug jest

# `babel-register`
`babel-register` tells `node.exe` to delegate all `.js` (or `.jsx, .ts, .tsx`, you need to tell `babel-register`) to `babel-core`; it extend `node`'s default moudle resolution system;
`babel-register` will internall call `source-map-support.install()` which will have source-map included in transpiled files (`"inline"` mode as well)


# `jest` v.s. `mocha`
`mocha` will consult `node.exe` for file extensions when `--compilers` is set;
 but `jest` won't; always use `node`'s default moudle resolution system;

# what does this mean?

1. `jest` use `babel` as its backing transpiler; 
2. `babel-register` doesn't work in `jest` althought it works perfectly with `mocha`;    
3.  when using `mocha`, you don't call `babel.transform(src, { sourceMaps: "inline", retainLines: true})` becuase you don't have to; 
    `node.js` will do that for you becuase `*.js` has been reserved by `babel`;
    when using `jest`, you will need to call `babel.transform(src, options)` explicitly because everything is handled by yourself;