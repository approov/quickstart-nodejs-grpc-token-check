# Generating NodeJS Sources from hello.proto File

After installing the Protocol Buffers compiler `protoc` and the plugin for generating JavaScript code through the NPM package [`grpc-tools`](https://www.npmjs.com/package/grpc-tools), the source files `hello_grpc_pb.js` and `hello_pb.js` can be generated in a command shell by changing to the directory containing this readme and the `hello.proto` file and then issuing the command:

```
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:. --grpc_out=grpc_js:. hello.proto
```

These generated sources are used by the server and client code located in the directories (relative to the root of the repo): `example`, `src/unprotected-server`, `src/approov-protected-server/token-check`, `src/approov-protected-server/token-binding-check`. This is for information only, as these directories already contain copies of all relevant generated sources.
