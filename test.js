/* eslint-disable */
const {
  graphql,
  GraphQLString,
  GraphQLSchema,
  GraphQLObjectType,
} = require('graphql');
const { MyMap } = require('./dist/js/index.js');

function createHelloSchema(type) {
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
    })
  });
}
const query = '{ hello(a: { k: "3" }) }';

graphql(createHelloSchema(MyMap(['j'])), query).then((response) => {
  console.dir(response, { depth: 5 });
});
