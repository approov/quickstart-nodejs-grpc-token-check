// Shapes server for Node GRPC Approov Backend Integration Quickstart
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

const messages = require('./shapes_pb');
const services = require('./shapes_grpc_pb');

const crypto = require('crypto');
const debug = require('debug')('shapes-server')
const dotenv = require('dotenv').config();
const grpc = require('@grpc/grpc-js');
const jwt = require('jsonwebtoken');

if (dotenv.error) {
  console.debug('FAILED TO PARSE `.env` FILE | ' + dotenv.error);
  console.log('Not using .env file, using built-in defaults');
}

/** Message contained in a hello reply */
const helloWorldMessage = "Hello, World!"

/** API key */
const apiSecretKey = "yXClypapWNHIifHUWmBIyPFAm"

// The hostname. To run in a docker container add to the .env file `SERVER_HOSTNAME=0.0.0.0`.
const hostname = dotenv?.parsed?.SERVER_HOSTNAME || 'localhost';

// The port from the .env file. Defaults to 50051
const port = dotenv?.parsed?.GRPC_PORT || 50051;

// The decoded Approv secret
const approovSecret = Buffer.from(dotenv.parsed.APPROOV_BASE64_SECRET || '', 'base64');

/**
 * Returns one of four shape names at random
 */
const randomShapeName = function() {
  const shapes = [
    'Circle',
    'Triangle',
    'Square',
    'Rectangle'
  ]
  return shapes[Math.floor((Math.random() * shapes.length))]
}

/**
 * Checks the validity of an API key
 */
const verifyAPIKey = function(apiKeyHeader) {
  // Check that API key is present
  if (! apiKeyHeader || ! apiKeyHeader) {
    // You may want to add some logging here.
    console.log("No API key");
    return false;
  }
  // Check that the API key is valid
  const apiKey = apiKeyHeader[0]
  if (apiKey != apiSecretKey) {
    console.log("Invalid API key");
  }
  return apiKey == apiSecretKey;
}

/**
 * Checks the validity of an Approov token
 */
const verifyApproovToken = function(approovTokenHeader) {
  // Check that Approov token is present
  if (!approovTokenHeader || !approovTokenHeader.length) {
    // You may want to add some logging here.
    return null;
  }
  // Check that Approov token is valid
  try {
    const approovToken = approovTokenHeader[0];
    var decodedClaims = jwt.verify(approovToken, approovSecret, {algorithms: ["HS256"]});
  } catch(err) {
    // You may want to add some logging here.
    return null;
  }
  // The Approov token was successfully verified
  return decodedClaims;
}

/**
 * Checks the validity of an Approov token binding
 */
const verifyApproovTokenBinding = function(boundAuthHeader, approovTokenClaims) {
  // The approovTokenClaims are null if the token didn't verify
  if (!approovTokenClaims) {
    // You may want to add some logging here.
    return false;
  }

  // Note that the `pay` (payload) claim will be present under normal circumstances. However, if the Approov failover
  // system is enabled, no `pay` claim will be present and if this is the case you want to return true, otherwise you
  // will not be able to benefit from the redundancy afforded by the failover system.
  if (!("pay" in approovTokenClaims)) {
    // You may want to add some logging here.
    return true;
  }
  bindingClaim = approovTokenClaims.pay

  // Check that the bound header is present
  if (!boundAuthHeader || !boundAuthHeader.length) {
    // You may want to add some logging here.
    return false;
  }

  // We need to compute the SHA256 hash of the token binding header, because this is what was included in the Approov
  // token in the mobile app.
  const boundAuthToken = boundAuthHeader[0];
  const hash = Buffer.from(crypto.createHash('sha256').update(boundAuthToken).digest('base64'), 'base64');
  var bindingHash = Buffer.from(bindingClaim, 'base64');
  return Buffer.compare(bindingHash, hash) == 0;
}

/**
 * Implements the hello RPC
 */
function hello(call, callback) {
  var reply = new messages.HelloReply();
  reply.setMessage(helloWorldMessage);
  console.log(reply.getMessage());
  callback(null, reply);
}

/**
 * Implements the shape RPC where an API key is required
 */
function shape(call, callback) {
  // Get the API key from the metadata and check it
  var apiKeyHeader = call.metadata.get('api-key');
  if (!verifyAPIKey(apiKeyHeader)) {
    const error = new Error("Unauthorized");
    console.log(error.message);
    callback(error, null);
    return;
  }
  // API key is valid, reply with a random shape
  var reply = new messages.ShapeReply();
  reply.setMessage(randomShapeName());
  console.log(reply.getMessage());
  callback(null, reply);
}

/**
 * Implements the shape RPC where an Approov token is required in addition to the API key
 */
function approovShape(call, callback) {
  // Get the API key from the metadata
  var apiKeyHeader = call.metadata.get('api-key');
  // Get the Approov token from the metadata
  var approovTokenHeader = call.metadata.get('approov-token');
  // We use the Authorization header here, but feel free to use any other header in an Approov token binding.
  // You need to bind this header to the Approov token in the mobile client app.
  var boundAuthHeader = call.metadata.get('authorization');

  // Check API key and Approov token's presence and validity
  var approovTokenClaims = verifyApproovToken(approovTokenHeader);
  if (!verifyAPIKey(apiKeyHeader) || !verifyApproovTokenBinding(boundAuthHeader, approovTokenClaims)) {
    const error = new Error("Unauthorized");
    console.log(error.message);
    callback(error, null);
    return;
  }
  // API key, Approov token and binding are valid, reply with a random shape
  var reply = new messages.ShapeReply();
  reply.setMessage(randomShapeName());
  console.log(reply.getMessage());
  callback(null, reply);
}

/**
 * Starts an RPC server that receives requests for the Shape service at the configured server hostname and port
 */
function main() {
  var server = new grpc.Server();
  server.addService(services.ShapeService, {hello: hello, shape: shape, approovShape: approovShape});

  // Insecure connection (TLS termination is done by Traefik)
  let credentials = grpc.ServerCredentials.createInsecure();
  server.bindAsync(hostname + ':' + port, credentials, () => {
    console.log(`Approov protected shapes server with token binding running at ${hostname}:${port}`);
    server.start();
  });
}

main();
