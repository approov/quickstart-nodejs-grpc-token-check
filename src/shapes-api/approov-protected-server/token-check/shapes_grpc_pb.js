// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// TODO Licence header
//
'use strict';
var grpc = require('@grpc/grpc-js');
var shapes_pb = require('./shapes_pb.js');

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
  // Sends a shape request
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
};

exports.ShapeClient = grpc.makeGenericClientConstructor(ShapeService);
