import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';

import {
  graphql,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLEnumType,
} from 'graphql';
import { GraphQLTypedMapType } from '../src/index';

function createHelloSchema(type: GraphQLScalarType) {
  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        hello: {
          type: GraphQLString,
          args: {
            a: {
              type,
            },
          },
          resolve: () => 'hello',
        },
      },
    }),
  });
}

const myTestEnum = new GraphQLEnumType({
  name: 'MyTestEnum',
  values: {
    OFF: {
      value: 0,
      description: 'off.',
    },
    ON: {
      value: 1,
      description: 'on.',
    },
  },
});

@suite class TestGraphQLTypedMapType { // eslint-disable-line @typescript-eslint/no-unused-vars
  @test async 'valid no key or type constraint'() {
    const { data, errors } = await graphql(createHelloSchema(GraphQLTypedMapType()), '{ hello(a: { k: "3" }) }');
    expect(data?.hello).equals('hello');
    expect(errors).is.undefined;
  }

  @test async 'valid no keys constraint and type constraint'() {
    const { data, errors } = await graphql(createHelloSchema(GraphQLTypedMapType(undefined, undefined, GraphQLString)), '{ hello(a: { k: "3" }) }');
    expect(data?.hello).equals('hello');
    expect(errors).is.undefined;
  }

  @test async 'take an enum'() {
    const { data, errors } = await graphql(createHelloSchema(GraphQLTypedMapType(undefined, undefined, myTestEnum)), '{ hello(a: { k: "ON" }) }');
    expect(data?.hello).equals('hello');
    expect(errors).is.undefined;

  }

  @test async 'invalid type'() {
    const { data, errors } = await graphql(createHelloSchema(GraphQLTypedMapType(undefined, undefined, GraphQLInt)), '{ hello(a: { k: "3" }) }');
    expect(data).is.undefined;
    expect(errors?.length).equals(1);
  }

  @test async 'invalid disallowed key'() {
    const { data, errors } = await graphql(createHelloSchema(GraphQLTypedMapType(undefined, ['j'])), '{ hello(a: { k: "3" }) }');
    expect(data).is.undefined;
    expect(errors?.length).equals(1);
  }

  @test async 'invalid key when no keys allowed'() {
    const { data, errors } = await graphql(createHelloSchema(GraphQLTypedMapType(undefined, [])), '{ hello(a: { k: "3" }) }');
    expect(data).is.undefined;
    expect(errors?.length).equals(1);
  }
}
