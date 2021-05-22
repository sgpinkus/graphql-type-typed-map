# GraphQLTypedMapType
How do you specify this Typescript in GraphQL?:

    interface MyType {
      [propName: string]: MyOtherType
    }

AFAIK you can't. You have to define all the fields of an object explicitly if you want to specify
the types of those fields.

[graphql-type-json](https://www.npmjs.com/package/graphql-type-json) provides `GraphQLJSONObject`
which allows for an arbitrary object. This simple package provides `GraphQLTypedMapType()` which
produces a `GraphQLScalarType` type that allows you to declare a more constrained type of object like
the Typescript above. It also allows your to optionally constrain which keys can be present at the top
level.

Note, the downside of defining custom scalar types is since the type is not part of GraphQL SDL, the
client side can't know in advance whether a type valid for custom scalar types.

*Protocol:*

    GraphQLTypedMapType = (name: string, allowedKeys?: string[], valueType?: any): GraphQLScalarType

*Usage:*

    // name parameter is required and must be unique.
    const type1: GraphQLScalarType = GraphQLTypedMapType("MyMap1", undefined, GraphQLString); // no key constraints.
    const type2: GraphQLScalarType = GraphQLTypedMapType("MyMap2", ['a','b','c'], GraphQLInt); // some key constraints.
