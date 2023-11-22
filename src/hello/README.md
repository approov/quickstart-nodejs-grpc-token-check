# Generating NodeJS Sources from hello.proto File

After installing the Protocol Buffers compiler [`protoc`](https://grpc.io/docs/protoc-installation/) and the plugin for generating JavaScript code through the NPM package [`grpc-tools`](https://www.npmjs.com/package/grpc-tools), the source files `hello_grpc_pb.js` and `hello_pb.js` can be generated in a command shell by changing to the directory containing this readme and the `hello.proto` file and then issuing the commands:

```shell
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:../examples --grpc_out=grpc_js:../examples hello.proto
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:unprotected-server --grpc_out=grpc_js:unprotected-server hello.proto
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:approov-protected-server/token-check --grpc_out=grpc_js:approov-protected-server/token-check hello.proto
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:approov-protected-server/token-binding-check --grpc_out=grpc_js:approov-protected-server/token-binding-check hello.proto
```

These generated sources are used by the server and client code located in the directories (relative to the root of the repo): `example`, `src/hello/unprotected-server`, `src/hello/approov-protected-server/token-check`, `src/hello/approov-protected-server/token-binding-check`. This is for information only, as these directories already contain copies of all relevant generated sources.
