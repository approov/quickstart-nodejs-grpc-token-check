# Approov QuickStart - NodeJS GRPC Token Check

[Approov](https://approov.io) is an API security solution used to verify that requests received by your backend services originate from trusted versions of your mobile apps.

This repo implements the Approov server-side request verification code in NodeJS for GRPC (Google Remote Procedure Call). It performs the verification check before allowing valid traffic to be processed by the GRPC server.


## TOC - Table of Contents

* [Why?](#why)
* [How it Works](#how-it-works)
* [Quickstarts](#approov-integration-quickstarts)
* [Examples](#approov-integration-examples)
* [Useful Links](#useful-links)


## Why?

You can learn more about Approov, the motives for adopting it, and more detail on how it works by following this [link](https://approov.io/product). In brief, Approov:

* Ensures that accesses to your API come from official versions of your apps; it blocks accesses from republished, modified, or tampered versions
* Protects the sensitive data behind your API; it prevents direct API abuse from bots or scripts scraping data and other malicious activity
* Secures the communication channel between your app and your API with [Approov Dynamic Certificate Pinning](https://approov.io/docs/latest/approov-usage-documentation/#approov-dynamic-pinning). This has all the benefits of traditional pinning but without the drawbacks
* Removes the need for an API key in the mobile app
* Provides DoS protection against targeted attacks that aim to exhaust the API server resources to prevent real users from reaching the service or at least to degrade the user experience.

[TOC](#toc---table-of-contents)


## How it Works

This is a brief overview of how the Approov cloud service and the NodeJS server fit together from a backend perspective. For a complete overview of how the mobile app and backend fit together with the Approov cloud service and the Approov SDK we recommend to read the [Approov overview](https://approov.io/product) page on our website.

### Approov Cloud Service

The Approov cloud service attests that a device is running a legitimate and tamper-free version of your mobile app.

* If the integrity check passes then a valid token is returned to the mobile app
* If the integrity check fails then a legitimate looking token will be returned

In either case, the app, unaware of the token's validity, adds it to every request it makes to the Approov protected API(s).

### NodeJS Backend Server

The NodeJS backend server ensures that the token supplied in the `Approov-Token` header is present and valid. The validation is performed using a shared secret known only to the Approov cloud service and the NodeJS backend server.

The request is handled such that:

* If the Approov token is valid, the GRPC request is allowed to be processed by the server
* If the Approov token is invalid, an "Unauthorized" error-response is returned

The server does not log token verification failures, leaving you to decide the right amount of information you want to log.


[TOC](#toc---table-of-contents)


## Approov Integration Quickstart Code

The quickstart code for the Approov NodeJS server is split into two implementations. The first gets you up and running with basic token checking. The second uses a more advanced Approov feature, _token binding_. Token binding may be used to link the Approov token with other properties of the request, such as user authentication (more details can be found in the [Approov User Manual](https://approov.io/docs/latest/approov-usage-documentation/#token-binding)).

* [Approov token check quickstart](/docs/APPROOV_TOKEN_QUICKSTART.md)
* [Approov token check with token binding quickstart](/docs/APPROOV_TOKEN_BINDING_QUICKSTART.md)

Both the protected servers are built from the unprotected example server defined in the [src/unprotected-server/hello-server-unprotected.js](/src/unprotected-server/hello-server-unprotected.js) directory. You can use your favourite file comparison tool to see the differences between them, or you can use Git like this:

Code difference between the Approov token checking server and the original unprotected server:

```
git diff --no-index src/unprotected-server/hello-server-unprotected.js src/approov-protected-server/token-check/hello-server-protected.js
```

Similarly for the Approov token binding checking server:

```
git diff --no-index src/unprotected-server/hello-server-unprotected.js src/approov-protected-server/token-binding-check/hello-server-protected.js
```

Or you can compare the code difference between the two Approov protected servers:

```
git diff --no-index src/approov-protected-server/token-check/hello-server-protected.js src/approov-protected-server/token-binding-check/hello-server-protected.js
```

[TOC](#toc---table-of-contents)


## Approov Integration Examples

### Prerequisites

* [Node.js](https://nodejs.org/) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed on your machine
* A trial or paid Approov account. You can sign up for a free trial at [https://www.approov.io/signup](https://www.approov.io/signup) (no credit card required)
* The `approov` command line tool [installed](https://approov.io/docs/latest/approov-installation/) with access to your account

### Example GRPC client and servers

You can find the example GRPC client that is used in the following examples in the [examples directory](/examples).

The unprotected server is located in the [src/unprotected-server directory](/src/unprotected-server) and you can find the Approov protected servers in the [/src/approov-protected-server/token-check](/src/approov-protected-server/token-check) and [/src/approov-protected-server/token-binding-check](/src/approov-protected-server/token-binding-check) directories, respectively.

### Unprotected

In a shell, in the `src/unprotected-server` directory, execute the following command to start the unprotected server:
```
npm install
npm start
```
The server will report:
```
Unprotected server running at localhost:50051
```

In another shell, in the `example` directory, start the client by executing this command:
```
npm install
npm start
```

The client will log to the console:
```
Target: localhost:50051
Hello, World!
```
and you should also see the output:
```
Hello, World!
```
appear in the shell in which you started the server.

### Approov Token Protected

In order for the Approov service to generate valid tokens you need to add a domain for which to generate tokens to Approov, using the Approov CLI command:
```
approov api -add example.com
```
For this example it does not matter which exact domain is used, but it needs to be reachable and accept HTTPS traffic. When you are done with the examples you can remove the domain again with this command:

```
approov api -remove example.com
```

In order for the server to be able to perform Approov token checking, it needs to know the secret that is used by the Approov service for signing tokens. To retrieve a secret with the Approov CLI you need to switch to the `admin` role by issuing this command in a shell:
```
eval `approov role admin`
```
You can then retrieve the secret using the Approov CLI:
```
approov secret -get base64
```
This will output the base64 encoded secret. Example:
```
$ approov secret -get base64
active role is admin in account example
WARNING: consider whether you can switch to a lower privilege role
enter password:
note: secret is base64 encoded and must be decoded to its binary form to verify Approov tokens
h+CX0tOzdAAR9l15bWAqvq7w9olk66daIH+Xk+IAHhVVHszjDzeGobzNnqyRze3lw/WVyWrc2gZfh3XXfBOmww==
```
For the server to use the secret, you need to set `APPROOV_BASE64_SECRET`, in the `.env` file in the Approov integration example server directory [src/approov-protected-server/token-ckeck](/src/approov-protected-server/token-ckeck), to the value retrieved in the previous step. For this, copy the file `.env.example` to `.env`, open `.env` in an editor and replace the text `<approov_base64_secret_here>` with the secret, like in this example:
```
APPROOV_BASE64_SECRET=h+CX0tOzdAAR9l15bWAqvq7w9olk66daIH+Xk+IAHhVVHszjDzeGobzNnqyRze3lw/WVyWrc2gZfh3XXfBOmww==
```
In a shell, in the `src/approov-protected-server/token-ckeck` directory, execute the following command to start the Approov protected server:
```
npm install
npm start
```
The server will report:
```
Approov protected server running at localhost:50051
```

#### Valid Request - Approov Token with Valid Signature and Expire Time

For the protected server to accept a GRPC request, the client has to include a valid Approov token in the request. You can generate an example token using the Approov CLI:
```
approov token -genExample example.com
```
This will output a valid sample Approov token signed with your Approov account's secret. Example:
```
$ approov token -genExample example.com
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDM5MjI5OTUsImlwIjoiMS4yLjMuNCIsImRpZCI6IkV4YW1wbGVBcHByb292VG9rZW5ESUQ9PSJ9.r_1kpqvFcete7OTCXbm-KMwIytNJwD4U23dkekn23YQ
```
The sample Approov token has a lifetime of one hour, after which it will become invalid.

In a shell, in the `example` directory, start the client by executing this command:
```
npm start -- --token <approov-token>
```
Where `<approov-token>` needs to be replaced by the token generated in the previous step. Example:
```
npm start -- --token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDM5MjI5OTUsImlwIjoiMS4yLjMuNCIsImRpZCI6IkV4YW1wbGVBcHByb292VG9rZW5ESUQ9PSJ9.r_1kpqvFcete7OTCXbm-KMwIytNJwD4U23dkekn23YQ
```

The client will log the target, the Approov token and the received response to the console:
```
Target: localhost:50051
Approov Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDM5MjI5OTUsImlwIjoiMS4yLjMuNCIsImRpZCI6IkV4YW1wbGVBcHByb292VG9rZW5ESUQ9PSJ9.r_1kpqvFcete7OTCXbm-KMwIytNJwD4U23dkekn23YQ
Hello, World!
```
and you should also see the output:
```
Hello, World!
```
appear in the shell in which you started the server.


#### Invalid Request - Approov Token with an Invalid Signature

The protected server rejects a GRPC request if an invalid or expired token is included, or if the token is missing altogether. An invalid token indicates that the mobile app failed the integrity check with the Approov cloud service or that an attacker is trying to spoof the Approov token. You can generate an invalid example token using the Approov CLI:
```
approov token -genExample example.com -type invalid
```
This will output an invalid sample Approov token which is signed with a secret that is different from your Approov account's secret. Example:
```
$ approov token -genExample example.com -type invalid
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDM5MzI4OTgsImlwIjoiMS4yLjMuNCIsImRpZCI6IkV4YW1wbGVBcHByb292VG9rZW5ESUQ9PSJ9.mVI7FjFHkNd3WM2HHoETCbFLqjz0_KfM1goZCx85mPM
```
In a shell, in the `example` directory, start the client by executing this command:
```
npm start -- --token <approov-token>
```
Where `<approov-token>` needs to be replaced by the invalid token generated in the previous step. Example:
```
npm start -- --token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDM5MzI4OTgsImlwIjoiMS4yLjMuNCIsImRpZCI6IkV4YW1wbGVBcHByb292VG9rZW5ESUQ9PSJ9.mVI7FjFHkNd3WM2HHoETCbFLqjz0_KfM1goZCx85mPM
```

The client will log the target, the Approov token and the received response to the console:
```
Target: localhost:50051
Approov Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDM5MzI4OTgsImlwIjoiMS4yLjMuNCIsImRpZCI6IkV4YW1wbGVBcHByb292VG9rZW5ESUQ9PSJ9.mVI7FjFHkNd3WM2HHoETCbFLqjz0_KfM1goZCx85mPM
Error: 2 UNKNOWN: Unauthorized
```
and you should also see the output:
```
Unauthorized
```
appear in the shell in which you started the server.

You can also check what happens if the token is missing - by issuing the `npm start` command without any token argument.

### Approov Token Binding Protected

Setting up and starting the Approov protected server with token binding in the [src/approov-protected-server/token-binding-check directory](/src/approov-protected-server/token-binding-check) is essentially the same as setting up the server without token binding. You can copy the `.env` file containing the secret from `src/approov-protected-server/token-check` and then, in a shell, in the `src/approov-protected-server/token-binding-check` directory, start the server with the command:
```
npm start
```
The server will report:
```
Approov protected server with token binding running at localhost:50051
```

#### Valid Requests - Approov Token with Valid Signature, Expire Time and Token Binding

The Approov protected server checks that the included Approov token was signed with the correct secret only known by the Approov Cloud service and the server itself. Additionally, for a token binding to be valid, the value in the token's `pay` claim must match the hash of the GRPC request's `Authorization` header. The server accepts a GRPC request only if both, the token signature and the binding, are valid.

You can generate an example token with a binding using the Approov CLI:
```
approov token -genExample example.com -setDataHashInToken EXAMPLE_USER_AUTHORIZATON_CREDENTIALS
```
This outputs a valid sample Approov token signed with your Approov account's secret and the token also contains the Base64 encoded hash of the string "EXAMPLE_USER_AUTHORIZATON_CREDENTIALS" in its `pay` claim. Example:
```
$ approov token -genExample example.com -setDataHashInToken EXAMPLE_USER_AUTHORIZATON_CREDENTIALS
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDM5MzY5NzgsImlwIjoiMS4yLjMuNCIsImRpZCI6IkV4YW1wbGVBcHByb292VG9rZW5ESUQ9PSIsInBheSI6ImRZalhtUXFFdUd4L1hsN2VXMU9aM3JWWUFBRmNEYmg1U3l2OEMxNnE5L0E9In0.VUsGkxpidA_YE1B-QBDLJYLnmxLJaCSRjNwRc4h4X9A
```
The sample Approov token has a lifetime of one hour, after which it will become invalid.

In a shell, in the `example` directory, start the client by executing this command:
```
npm start -- --token <approov-token> --auth EXAMPLE_USER_AUTHORIZATON_CREDENTIALS
```
Where `<approov-token>` needs to be replaced by the token generated in the previous step. It is important that the `auth` argument matches the authorization string "EXAMPLE_USER_AUTHORIZATON_CREDENTIALS" used when the Approov token was generated in the previous step. Example:
```
npm start -- --token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDM5MzY5NzgsImlwIjoiMS4yLjMuNCIsImRpZCI6IkV4YW1wbGVBcHByb292VG9rZW5ESUQ9PSIsInBheSI6ImRZalhtUXFFdUd4L1hsN2VXMU9aM3JWWUFBRmNEYmg1U3l2OEMxNnE5L0E9In0.VUsGkxpidA_YE1B-QBDLJYLnmxLJaCSRjNwRc4h4X9A --auth EXAMPLE_USER_AUTHORIZATON_CREDENTIALS
```

The client will log the target, the Approov token, the bound authorization string and the received response to the console:
```
Target: localhost:50051
Approov Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDM5MzY5NzgsImlwIjoiMS4yLjMuNCIsImRpZCI6IkV4YW1wbGVBcHByb292VG9rZW5ESUQ9PSIsInBheSI6ImRZalhtUXFFdUd4L1hsN2VXMU9aM3JWWUFBRmNEYmg1U3l2OEMxNnE5L0E9In0.VUsGkxpidA_YE1B-QBDLJYLnmxLJaCSRjNwRc4h4X9A
Authorization: EXAMPLE_USER_AUTHORIZATON_CREDENTIALS
Hello, World!
```
and you should also see the output:
```
Hello, World!
```
appear in the shell in which you started the server.

#### Invalid Request - Approov Token with an Invalid Token Binding

If the token's `pay` claim doesn't match the hash of the `Authorization` header, the server rejects the GRPC request - even if the Approov token's signature is valid.

In a shell, in the `example` directory, start the client by executing this command:
```
npm start -- --token <approov-token> --auth ANOTHER_EXAMPLE_USER_AUTHORIZATON_CREDENTIALS
```
Where `<approov-token>` needs to be replaced by the token generated in the previous section. Note that the authorization string is different from the one used to generate the sample Approov token. Example:
```
npm start -- --token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDM5MzY5NzgsImlwIjoiMS4yLjMuNCIsImRpZCI6IkV4YW1wbGVBcHByb292VG9rZW5ESUQ9PSIsInBheSI6ImRZalhtUXFFdUd4L1hsN2VXMU9aM3JWWUFBRmNEYmg1U3l2OEMxNnE5L0E9In0.VUsGkxpidA_YE1B-QBDLJYLnmxLJaCSRjNwRc4h4X9A --auth ANOTHER_EXAMPLE_USER_AUTHORIZATON_CREDENTIALS
```

The client will log the target, the Approov token, the modified authorization string and the received response to the console. Example:
```
Target: localhost:50051
Approov Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDM5MzY5NzgsImlwIjoiMS4yLjMuNCIsImRpZCI6IkV4YW1wbGVBcHByb292VG9rZW5ESUQ9PSIsInBheSI6ImRZalhtUXFFdUd4L1hsN2VXMU9aM3JWWUFBRmNEYmg1U3l2OEMxNnE5L0E9In0.VUsGkxpidA_YE1B-QBDLJYLnmxLJaCSRjNwRc4h4X9A
Authorization: ANOTHER_EXAMPLE_USER_AUTHORIZATON_CREDENTIALS
Error: 2 UNKNOWN: Unauthorized
```
and you should also see the output:
```
Unauthorized
```
appear in the shell in which you started the server.

[TOC](#toc---table-of-contents)


## Useful Links

If you wish to explore the Approov solution in more depth, then why not try one of the following links as a jumping off point:

* [Approov Free Trial](https://approov.io/signup) (no credit card required)
* [Approov QuickStarts](https://approov.io/docs/latest/approov-integration-examples/)
* [Approov Live Demo](https://approov.io/product/demo)
* [Approov Docs](https://approov.io/docs)
* [Approov Blog](https://blog.approov.io)
* [Approov Resources](https://approov.io/resource/)
* [Approov Customer Stories](https://approov.io/customer)
* [Approov Support](https://approov.zendesk.com/hc/en-gb/requests/new)
* [About Us](https://approov.io/company)
* [Contact Us](https://approov.io/contact)


[TOC](#toc---table-of-contents)
