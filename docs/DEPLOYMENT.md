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

Make the request:
```shell
grpcurl -proto shapes.proto -d '{"dummy": "test"}' unprotected-grpc.demo.approov.io:443 shapes.Shape/Hello
```
You should see:
```shell
{
  "message": "Hello, World!"
}
```

The `Shape` request requires a valid API key:
```shell
grpcurl -proto shapes.proto -d '{"dummy": "test"}' -H 'API-Key: yXClypapWNHIifHUWmBIyPFAm' unprotected-grpc.demo.approov.io:443 shapes.Shape/Shape
```
You should see a response with a shape:
```shell
{
  "message": "Circle"
}
```

### Approov Token Check

The `Hello` request is always unprotected:
```shell
grpcurl -proto shapes.proto -d '{"dummy": "test"}' token-grpc.demo.approov.io:443 shapes.Shape/Hello
```
You should see:
```shell
{
  "message": "Hello, World!"
}
```

The `Shape` request requires a valid Approov token in addition to the API key. Ensure that the GRPC API has been added to the Approov account:
```shell
approov api -add token-grpc.demo.approov.io
```

Generate an example token:
```shell
approov token -genExample token-grpc.demo.approov.io
```

Make the request, replacing `APPROOV-TOKEN` with the token generated in the previous step:
```shell
grpcurl -proto shapes.proto -d '{"dummy": "test"}' \
  -H 'API-Key: yXClypapWNHIifHUWmBIyPFAm' \
  -H 'Approov-Token: APPROOV-TOKEN' \
  token-grpc.demo.approov.io:443 shapes.Shape/Shape
```
You should see a response with a shape:
```shell
{
  "message": "Rectangle"
}
```

### Approov Token Binding Check

The `Hello` request is always unprotected:
```shell
grpcurl -proto shapes.proto -d '{"dummy": "test"}' token-binding-grpc.demo.approov.io:443 shapes.Shape/Hello
```
You should see:
```shell
{
  "message": "Hello, World!"
}
```

The `Shape` request requires a valid Approov token in addition to the API key. Ensure that the GRPC API has been added to the Approov account:
```shell
approov api -add token-binding-grpc.demo.approov.io
```

Generate an example token:
```shell
approov token -genExample token-binding-grpc.demo.approov.io:443 -setDataHashInToken EXAMPLE_USER_AUTHORIZATON_CREDENTIALS
```

Make the request, replacing `APPROOV-TOKEN` with the token generated in the previous step:
```shell
grpcurl -proto shapes.proto -d '{"dummy": "test"}' \
  -H 'API-Key: yXClypapWNHIifHUWmBIyPFAm' \
  -H 'Approov-Token: APPROOV-TOKEN' \
  -H 'Authorization: EXAMPLE_USER_AUTHORIZATON_CREDENTIALS' \
  token-binding-grpc.demo.approov.io:443 shapes.Shape/Shape
```
You should see a response with a shape:
```shell
{
  "message": "Triangle"
}
```
