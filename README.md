# GraphQLTypedMapType
How do you specify this Typescript in GraphQL?:

    interface MyType {
      [propName: string]: MyOtherType
    }

AFAIK you can't. You have to define all the fields of an object explicitly if you want to specify
the types of those fields. This package provides `GraphQLTypedMapType()` which is produces a
`GraphQLScalarType` type that allows you to do that. Secondly it allows your to optionally constrain
which keys can be present.

Note the downside of defining custom scalar types is since the type is not part of GraphQL SDL, the
client side can't know in advance, whether a type valid for custom scalar types.

Note [graphql-type-json](https://www.npmjs.com/package/graphql-type-json) provides `GraphQLJSONObject`
which allows for an arbitrary object.

*Protocol:*

    GraphQLTypedMapType = (allowedKeys?: string[], valueType?: any): GraphQLScalarType

*Usage:*

    const type1: GraphQLScalarType = GraphQLTypedMapType(undefined, GraphQLString); // no key constraints.
    const type2: GraphQLScalarType = GraphQLTypedMapType(['a','b','c'], GraphQLInt); // some key constraints.
