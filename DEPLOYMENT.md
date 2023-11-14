# DEPLOYMENT

Guide to deploy the Docker stack for the API backend examples in this Approov quickstart to production.

## Requirements

The docker stack used in this deployment assumes that the host server is running Traefik. See [AWS EC2 Traefik Setup](https://github.com/approov/aws-ec2-traefik-setup).


## How to Deploy to Production

Clone the repo:

```shell
git clone https://github.com/approov/quickstart-nodejs-grpc-token-check.git
```

Change directory to `quickstart-nodejs-grpc-token-check`.

Create the `.env` file by copying `.env.example`:

```shell
cp .env.example .env
```
> **IMPORTANT:** Add the secret as instructed in the `.env` file comments.

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

You can check that the services work by following the instructions in the readme section: [Example GRPC Client and Servers](https://github.com/approov/quickstart-nodejs-grpc-token-check/tree/demo-server-updates#example-grpc-client-and-servers).