# DEPLOYMENT

Guide to deploy the Docker stack for the API backend examples in this Approov quickstart to production.

## Requirements

The docker stack used in this deployment assumes that the host server is running Traefik. See [AWS EC2 Traefik Setup](https://github.com/approov/aws-ec2-traefik-setup).


## Deploying to Production

Clone the repo:

```shell
git clone https://github.com/approov/quickstart-nodejs-grpc-token-check.git
```

Change directory to `quickstart-nodejs-grpc-token-check/src/shapes-api`.

Create the `.env` file by copying `.env.example`:

```shell
cp .env.example .env
```
> **IMPORTANT:** Add the secret as described in the `.env` file comments or the readme's [Approov Token Protected](./../README.md#approov-token-protected) section.

Run all services in the background:

```shell
sudo docker-compose up --detach
```
> **NOTE:** The first time you run the command it will build the docker images.

At any time check the logs with:

```shell
sudo docker-compose logs --follow
```

If you update the `.env` file, then you need to bring down the docker stack and bring it up again, a restart will not reload the `.env` file.

```shell
sudo docker-compose down && sudo docker-compose up --detach
```

## Testing the Services

You can check that the services work by using `grpcurl` to make the API requests and the Approov CLI to generate example tokens.

In the directory `src/shapes-api`:

### Unprotected

```shell
grpcurl -proto shapes.proto -d '{"dummy": "test"}' unprotected-grpc.demo.approov.io shapes.Shape/Hello
{
  "message": "Hello, World!"
}
```

```shell
grpcurl -proto shapes.proto -d '{"dummy": "test"}' unprotected-grpc.demo.approov.io shapes.Shape/Shape
{
  "message": "Circle"
}
```

### Approov Token Check

The `Hello` request is always unprotected:
```shell
grpcurl -proto shapes.proto -d '{"dummy": "test"}' token-grpc.demo.approov.io shapes.Shape/Hello

{
  "message": "Hello, World!"
}
```

Ensure that the GRPC API has been added to the Approov account:
```shell
approov api -add token-grpc.demo.approov.io
```

Generate an example token:
```shell
approov token -genExample token-grpc.demo.approov.io

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDA2NjY4MDMsImlwIjoiMS4yLjMuNCIsImRpZCI6IkV4YW1wbGVBcHByb292VG9rZW5ESUQ9PSJ9.xw0-InS1r-r2stGycs4tUPPwakXAM5oPb-QblTTOsiM
```

Make the request (replace the example token with the token you generated in the previous step):
```shell
grpcurl -proto shapes.proto -d '{"dummy": "test"}' \
  -H 'Approov-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDA2NjY4MDMsImlwIjoiMS4yLjMuNCIsImRpZCI6IkV4YW1wbGVBcHByb292VG9rZW5ESUQ9PSJ9.xw0-InS1r-r2stGycs4tUPPwakXAM5oPb-QblTTOsiM' \
  token-grpc.demo.approov.io shapes.Shape/Shape

{
  "message": "Rectangle"
}
```

### Approov Token Binding Check

The `Hello` request is always unprotected:
```shell
grpcurl -proto shapes.proto -d '{"dummy": "test"}' token-binding-grpc.demo.approov.io shapes.Shape/Hello

{
  "message": "Hello, World!"
}
```

Ensure that the GRPC API has been added to the Approov account:
```shell
approov api -add token-binding-grpc.demo.approov.io
```

Generate an example token:
```shell
approov token -genExample token-binding-grpc.demo.approov.io -setDataHashInToken EXAMPLE_USER_AUTHORIZATON_CREDENTIALS
```

Make the request (replace the example token with the token you generated in the previous step):
```shell
grpcurl -proto shapes.proto -d '{"dummy": "test"}' \
  -H 'Approov-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDA2Njc0ODYsImlwIjoiMS4yLjMuNCIsImRpZCI6IkV4YW1wbGVBcHByb292VG9rZW5ESUQ9PSIsInBheSI6ImRZalhtUXFFdUd4L1hsN2VXMU9aM3JWWUFBRmNEYmg1U3l2OEMxNnE5L0E9In0.YeEvmukUyGIzNpoo7NXb2ZMutImKWCU1_2E2m16b2RY' \
  -H 'Authorization: EXAMPLE_USER_AUTHORIZATON_CREDENTIALS' \
  token-binding-grpc.demo.approov.io shapes.Shape/Shape

{
  "message": "Triangle"
}
```
