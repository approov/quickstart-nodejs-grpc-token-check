# Generating NodeJS Sources from shapes.proto File

After installing the Protocol Buffers compiler [`protoc`](https://grpc.io/docs/protoc-installation/) and the plugin for generating JavaScript code through the NPM package [`grpc-tools`](https://www.npmjs.com/package/grpc-tools), the source files `shapes_grpc_pb.js` and `shapes_pb.js` can be generated in a command shell by changing to the directory containing this readme and the `shapes.proto` file and then issuing the commands:

```shell
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:unprotected-server --grpc_out=grpc_js:unprotected-server shapes.proto
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:approov-protected-server/token-check --grpc_out=grpc_js:approov-protected-server/token-check shapes.proto
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:approov-protected-server/token-binding-check --grpc_out=grpc_js:approov-protected-server/token-binding-check shapes.proto
```

These generated sources are used by the server code located in the directories (relative to the root of the repo): `src/shapes-api/shapes-api/unprotected-server`, `src/shapes-api/shapes-api/approov-protected-server/token-check`, `src/shapes-api/approov-protected-server/shapes-api/token-binding-check`. This is for information only, as these directories already contain copies of all relevant generated sources.

# Testing

Copy `.env.example` to `.env`.

Get the approov secret:
```shell
approov secret -get base64
```

Add the secret to the `.env` file, replacing `approov-base64-encoded-secret-here`.

Start the docker containers:
```shell
docker compose up -d
```

Each container provides a locally exposed port for testing:
| Service                  | Port  |
|--------------------------|-------|
| Unprotected              | 50052 |
| With token check         | 50053 |
| With token binding check | 50054 |

Make the `hello` requests:
```shell
grpcurl -proto shapes.proto -plaintext -d '{"dummy": "test"}' localhost:50052 shapes.Shape/Hello
grpcurl -proto shapes.proto -plaintext -d '{"dummy": "test"}' localhost:50053 shapes.Shape/Hello
grpcurl -proto shapes.proto -plaintext -d '{"dummy": "test"}' localhost:50054 shapes.Shape/Hello
```
In each case the response should be:
```shell
{
  "message": "Hello, World!"
}
```

Make the API-key protected shape requests:
```shell
grpcurl -proto shapes.proto -plaintext -d '{"dummy": "test"}' -H 'API-Key: yXClypapWNHIifHUWmBIyPFAm' localhost:50052 shapes.Shape/Shape
grpcurl -proto shapes.proto -plaintext -d '{"dummy": "test"}' -H 'API-Key: yXClypapWNHIifHUWmBIyPFAm' localhost:50053 shapes.Shape/Shape
grpcurl -proto shapes.proto -plaintext -d '{"dummy": "test"}' -H 'API-Key: yXClypapWNHIifHUWmBIyPFAm' localhost:50054 shapes.Shape/Shape
```
In each case the response should be a shape:
```shell
{
  "message": "Triangle"
}
```

Obtain an Approov example token:
```shell
approov token -genExample localhost
```
Make the Approov token protected shape request, replacing `generated-approov-token` with the token returned in the previous step:
```shell
grpcurl -proto shapes.proto -plaintext -d '{"dummy": "test"}' -H 'API-Key: yXClypapWNHIifHUWmBIyPFAm' -H 'Approov-Token: generated-approov-token' localhost:50053 shapes.Shape/ApproovShape
```
The response should be a shape:
```shell
{
  "message": "Circle"
}
```

Obtain an Approov example token containing a binding of an authorization token:
```shell
approov token -genExample localhost -setDataHashInToken TEST
```

Make the Approov token protected shape request, replacing `generated-approov-token` with the token returned in the previous step:
```shell
grpcurl -proto shapes.proto -plaintext -d '{"dummy": "test"}' -H 'API-Key: yXClypapWNHIifHUWmBIyPFAm' -H 'Approov-Token: generated-approov-token' -H 'Authorization: TEST' localhost:50054 shapes.Shape/ApproovShape
```
The response should be a shape:
```shell
{
  "message": "Rectangle"
}
```
