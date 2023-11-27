// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// Protocol buffers definition for Approov Shapes App Demo (using GRPC)
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
var shapes_pb = require('./shapes_pb.js');

function serialize_shapes_ApproovShapeRequest(arg) {
  if (!(arg instanceof shapes_pb.ApproovShapeRequest)) {
    throw new Error('Expected argument of type shapes.ApproovShapeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_shapes_ApproovShapeRequest(buffer_arg) {
  return shapes_pb.ApproovShapeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_shapes_HelloReply(arg) {
  if (!(arg instanceof shapes_pb.HelloReply)) {
    throw new Error('Expected argument of type shapes.HelloReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_shapes_HelloReply(buffer_arg) {
  return shapes_pb.HelloReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_shapes_HelloRequest(arg) {
  if (!(arg instanceof shapes_pb.HelloRequest)) {
    throw new Error('Expected argument of type shapes.HelloRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_shapes_HelloRequest(buffer_arg) {
  return shapes_pb.HelloRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_shapes_ShapeReply(arg) {
  if (!(arg instanceof shapes_pb.ShapeReply)) {
    throw new Error('Expected argument of type shapes.ShapeReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_shapes_ShapeReply(buffer_arg) {
  return shapes_pb.ShapeReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_shapes_ShapeRequest(arg) {
  if (!(arg instanceof shapes_pb.ShapeRequest)) {
    throw new Error('Expected argument of type shapes.ShapeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_shapes_ShapeRequest(buffer_arg) {
  return shapes_pb.ShapeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


// The greeting service definition.
var ShapeService = exports.ShapeService = {
  // Sends a hello, requesting a "hello" response.
hello: {
    path: '/shapes.Shape/Hello',
    requestStream: false,
    responseStream: false,
    requestType: shapes_pb.HelloRequest,
    responseType: shapes_pb.HelloReply,
    requestSerialize: serialize_shapes_HelloRequest,
    requestDeserialize: deserialize_shapes_HelloRequest,
    responseSerialize: serialize_shapes_HelloReply,
    responseDeserialize: deserialize_shapes_HelloReply,
  },
  // Sends a shape request where the GRPC server requires an API key
shape: {
    path: '/shapes.Shape/Shape',
    requestStream: false,
    responseStream: false,
    requestType: shapes_pb.ShapeRequest,
    responseType: shapes_pb.ShapeReply,
    requestSerialize: serialize_shapes_ShapeRequest,
    requestDeserialize: deserialize_shapes_ShapeRequest,
    responseSerialize: serialize_shapes_ShapeReply,
    responseDeserialize: deserialize_shapes_ShapeReply,
  },
  // Sends a shape request, where the GRPC server requires an Approov token in addition to the API key
approovShape: {
    path: '/shapes.Shape/ApproovShape',
    requestStream: false,
    responseStream: false,
    requestType: shapes_pb.ApproovShapeRequest,
    responseType: shapes_pb.ShapeReply,
    requestSerialize: serialize_shapes_ApproovShapeRequest,
    requestDeserialize: deserialize_shapes_ApproovShapeRequest,
    responseSerialize: serialize_shapes_ShapeReply,
    responseDeserialize: deserialize_shapes_ShapeReply,
  },
};

exports.ShapeClient = grpc.makeGenericClientConstructor(ShapeService);
