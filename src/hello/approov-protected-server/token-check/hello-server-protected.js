// Hello server for Node GRPC Approov Token-Check Quickstart
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

const messages = require('./hello_pb');
const services = require('./hello_grpc_pb');

const debug = require('debug')('hello-server');
const dotenv = require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const jwt = require('jsonwebtoken');


if (dotenv.error) {
  console.debug('FAILED TO PARSE `.env` FILE | ' + dotenv.error);
  console.log('Not using .env file, using built-in defaults');
}


/** Message contained in a hello reply */
const helloWorldMessage = "Hello, World!";

// The hostname. To run in a docker container add to the .env file `SERVER_HOSTNAME=0.0.0.0`.
const hostname = dotenv?.parsed?.SERVER_HOSTNAME || 'localhost';

// The port from the .env file. Defaults to 50051
const port = dotenv?.parsed?.GRPC_PORT || 50051;

// The decoded Approv secret
const approovSecret = Buffer.from(dotenv.parsed.APPROOV_BASE64_SECRET || '', 'base64');


/**
 * Checks the validity of an Approov token
 */
const verifyApproovToken = function(approovTokenHeader) {
  // Check that Approov token is present
  if (!approovTokenHeader || !approovTokenHeader.length) {
    // You may want to add some logging here.
    return false;
  }
  // Check that Approov token is valid
  try {
    const approovToken = approovTokenHeader[0]
    var decodedClaims = jwt.verify(approovToken, approovSecret, {algorithms: ["HS256"]});
  } catch(err) {
    // You may want to add some logging here.
    return false;
  }
  // The Approov token was successfully verified
  return true;
}

/**
 * Implements the hello RPC
 */
function hello(call, callback) {
  // Get the Approov token from the metadata and check its presence and validity
  var approovTokenHeader = call.metadata.get('approov-token');
  if (!verifyApproovToken(approovTokenHeader)) {
    const error = new Error("Unauthorized");
    console.log(error.message);
    callback(error, null);
    return;
  }
  // Approov token is valid, reply with a hello
  var reply = new messages.HelloReply();
  reply.setMessage(helloWorldMessage);
  console.log(reply.getMessage());
  callback(null, reply);
}

/**
 * Starts an RPC server that receives requests for the Hello service at the configured server hostname and port
 */
function main() {
  var server = new grpc.Server();
  server.addService(services.HelloService, {hello: hello});

  // Insecure connection
  let credentials = grpc.ServerCredentials.createInsecure();

  server.bindAsync(hostname + ':' + port, credentials, () => {
    console.log(`Approov protected server running at ${hostname}:${port}`);
    server.start();
  });
}

main();
