# Generating NodeJS Sources from shapes.proto File

After installing the Protocol Buffers compiler [`protoc`](https://grpc.io/docs/protoc-installation/) and the plugin for generating JavaScript code through the NPM package [`grpc-tools`](https://www.npmjs.com/package/grpc-tools), the source files `shapes_grpc_pb.js` and `shapes_pb.js` can be generated in a command shell by changing to the directory containing this readme and the `shapes.proto` file and then issuing the commands:

```shell
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:../examples --grpc_out=grpc_js:../examples shapes.proto
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:unprotected-server --grpc_out=grpc_js:unprotected-server shapes.proto
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:approov-protected-server/token-check --grpc_out=grpc_js:approov-protected-server/token-check shapes.proto
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:approov-protected-server/token-binding-check --grpc_out=grpc_js:approov-protected-server/token-binding-check shapes.proto
```

These generated sources are used by the server code located in the directories (relative to the root of the repo): `src/shapes-api/shapes-api/unprotected-server`, `src/shapes-api/shapes-api/approov-protected-server/token-check`, `src/shapes-api/approov-protected-server/shapes-api/token-binding-check`. This is for information only, as these directories already contain copies of all relevant generated sources.
