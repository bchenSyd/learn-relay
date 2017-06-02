# re-compile
```
$ find . -name __generated__  -print
./js/components/__generated__
./js/mutations/__generated__
./js/__generated__

find . -name __generated__  -print | xargs rm -rf
or
find . -name __generated__ -exec rm -rf {} \;
```
make sure watchman.exe is killed from explorer
```
The latest alpha build is available here:
http://bit.ly/watchmanwinalpha
D:\__work\relay\packages\relay-compiler\codegen\RelayCodegenWatcher.js
const watchman = require('fb-watchman');

class PromiseClient {
  _client: any;

  constructor() {
    this._client = new watchman.Client();
  }

```


# source 
  ```
  RelayNetwork.js 

  function create(fetch, subscribe) {
    function requestStream(operation, variables, cacheConfig, _ref) {
          fetch(operation, variables, cacheConfig).then(function (payload) {
              try {
                  relayPayload = normalizePayload(operation, variables, payload);
              } catch (err) {
                  onError && onError(err);
                  return;
              }
              _onNext && _onNext(relayPayload);
  }



  function normalizeRelayPayload(selector, payload, errors) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { handleStrippedNulls: false };

    var source = new (require('./RelayInMemoryRecordSource'))();
    source.set(ROOT_ID, require('./RelayModernRecord').create(ROOT_ID, ROOT_TYPE));
    var fieldPayloads = require('./RelayResponseNormalizer').normalize(source, selector, payload, options);  // traverse
    return {
      errors: errors,
      fieldPayloads: fieldPayloads,
      source: source
    };
  }

  // webpack:///./~/relay-runtime/lib/RelayResponseNormalizer.js
  RelayResponseNormalizer.prototype._traverseSelections = function _traverseSelections(selections, record, data) {
      var _this = this;

      selections.forEach(function (selection) {
        if (selection.kind === SCALAR_FIELD || selection.kind === LINKED_FIELD) {
          _this._normalizeField(selection, record, data);
        } else if (selection.kind === CONDITION) {
          var conditionValue = _this._getVariableValue(selection.condition);
          if (conditionValue === selection.passingValue) {
            _this._traverseSelections(selection.selections, record, data);
          }
        } else if (selection.kind === INLINE_FRAGMENT) {
          var typeName = require('./RelayModernRecord').getType(record);
          if (typeName === selection.type) {
            _this._traverseSelections(selection.selections, record, data);
          }
        } else if (selection.kind === LINKED_HANDLE || selection.kind === SCALAR_HANDLE) {
          var args = selection.args ? getArgumentValues(selection.args, _this._variables) : {};

          var fieldKey = require('./formatStorageKey')(selection.name, args);
          var handleKey = require('./getRelayHandleKey')(selection.handle, selection.key, selection.name);
          if (selection.filters) {
            var filterValues = require('./RelayStoreUtils').getHandleFilterValues(selection.args || [], selection.filters, _this._variables);
            handleKey = require('./formatStorageKey')(handleKey, filterValues);
          }
          _this._handleFieldPayloads.push({
            args: args,
            dataID: require('./RelayModernRecord').getDataID(record),
            fieldKey: fieldKey,
            handle: selection.handle,
            handleKey: handleKey
          });
        } else {
          require('fbjs/lib/invariant')(false, 'RelayResponseNormalizer(): Unexpected ast kind `%s`.', selection.kind);
        }
      });
    };
  ```

  #viewerHandler
  ```
  D:\relay\packages\relay-runtime\handlers\viewer\RelayViewerHandler.js
    // viewer: synthesize a record at the canonical viewer id, copy its fields
    // from the server record, and delete the server record link to speed up GC.
    const clientViewer =
      store.get(VIEWER_ID) || store.create(VIEWER_ID, VIEWER_TYPE);
    clientViewer.copyFieldsFrom(serverViewer);
    record.setValue(null, payload.fieldKey);
    //getRelayHandleKey.js    { return '__' + fieldName + '_' + handleName; }
    record.setLinkedRecord(clientViewer, payload.handleKey);
    /* result:
      {
        client:root:{
          __id:'client:root
          __typename:'__Root'
          viewer: null // record.setValue(null, payload.fieldKey); server record is deleted;
          __viewer_viewer: {__ref:'client:root:viewer'}
        }
        client:root:viewer  {
          __id:'client:root:viewer'
          __typename:'Viewer
          user:{
            __ref:'User:me'
          }
        }
      }
    */
  ```

# watchman
  get latest windows build [here](https://github.com/facebook/watchman/issues/475 )
  or click [here directly](https://ci.appveyor.com/api/buildjobs/kcl3jeagtytirksa/artifacts/watchman.zip)

  Extract the zip file and make sure that watchman.exe is located in your PATH.
  The watchman.pdb file is provided to facilitate debugging.

  ```
 $ watchman
  {
      "error": "invalid command (expected an array with some elements!)",
      "version": "4.9.0",
      "cli_validated": true
  }
  ```

#flow
how does flow work? what is the flow syntax transpiler?  -- answer is babel
can't work without babel
```
$ npm ls babel-preset-flow
D:\learn-relay\relay-modern
`-- babel-preset-react@6.24.1
  `-- babel-preset-flow@6.23.0

```