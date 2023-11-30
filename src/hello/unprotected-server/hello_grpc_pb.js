// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// Protocol buffers definition for Node GRPC Approov Token-Check Quickstart
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
//
'use strict';
var grpc = require('@grpc/grpc-js');
var hello_pb = require('./hello_pb.js');

function serialize_hello_HelloReply(arg) {
  if (!(arg instanceof hello_pb.HelloReply)) {
    throw new Error('Expected argument of type hello.HelloReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hello_HelloReply(buffer_arg) {
  return hello_pb.HelloReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_hello_HelloRequest(arg) {
  if (!(arg instanceof hello_pb.HelloRequest)) {
    throw new Error('Expected argument of type hello.HelloRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hello_HelloRequest(buffer_arg) {
  return hello_pb.HelloRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


// The hello service definition.
var HelloService = exports.HelloService = {
  // Sends a hello, requesting a "hello" response.
hello: {
    path: '/hello.Hello/Hello',
    requestStream: false,
    responseStream: false,
    requestType: hello_pb.HelloRequest,
    responseType: hello_pb.HelloReply,
    requestSerialize: serialize_hello_HelloRequest,
    requestDeserialize: deserialize_hello_HelloRequest,
    responseSerialize: serialize_hello_HelloReply,
    responseDeserialize: deserialize_hello_HelloReply,
  },
};

exports.HelloClient = grpc.makeGenericClientConstructor(HelloService);
