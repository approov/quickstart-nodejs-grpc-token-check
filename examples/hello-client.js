// Hello client for Node GRPC Approov Token-Check Quickstart
//
// MIT License
//
// Copyright (c) 2016-present, Critical Blue Ltd.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
// Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const grpc = require('@grpc/grpc-js');
const parseArgs = require('minimist');
const messages = require('./hello_pb');
const services = require('./hello_grpc_pb');


function main() {
  // Get arguments
  var argv = parseArgs(process.argv.slice(2), {
    string: ['target', 'token', 'auth'],
    boolean: ['tls']
  });
  // Target
  var target;
  if (argv.target) {
    target = argv.target;
  } else {
    target = 'localhost:50051';
  }
  console.log('Target:', target);
  // Approov token
  var approovToken = null;
  if (argv.token) {
    approovToken = argv.token;
    console.log('Approov Token:', approovToken);
  }
  // Authorization
  var authorization = null;
  if (argv.auth) {
    authorization = argv.auth;
    console.log('Authorization:', authorization);
  }
  // TLS
  var credentials;
  if (argv.tls) {
    // Secure connection
    credentials = grpc.credentials.createSsl();
  } else {
    // Insecure connection
    credentials = grpc.credentials.createInsecure();
  }

  var client = new services.HelloClient(target, credentials);

  // Create request
  var request = new messages.HelloRequest();
  // Create metadata (headers) to add to the request
  const metadata = new grpc.Metadata();
  // Add Approov token if present in arguments
  if (approovToken) {
      metadata.set("Approov-Token", approovToken);
  }
  // Add authorization if present in arguments
  if (authorization) {
      metadata.set("Authorization", authorization);
  }

  // Perform RPC and log response
  client.hello(request, metadata, function(err, response) {
    if (err) {
      console.log('Error:', err.message);
    }
    if (response) {
      console.log(response.getMessage());
    }
  });
}

main();
