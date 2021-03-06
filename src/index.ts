import { GraphQLScalarType, GraphQLEnumType } from 'graphql';
import { Kind, ValueNode, ObjectValueNode, print } from 'graphql/language';
import Set from 'core-js-pure/features/set';

export class GraphQLTypedMapTypeTypeError extends TypeError {}

type ValueType = GraphQLScalarType | GraphQLEnumType; // TODO: more types?

function ensureObject(value: unknown, allowedKeys?: Set<string>, valueType?: ValueType) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new GraphQLTypedMapTypeTypeError(
      `Cannot represent non-object value: ${value}`,
    );
  }
  if(allowedKeys) {
    const keys: Set<string> = new Set(Object.keys(value));
    if (!allowedKeys.isSupersetOf(keys)) {
      throw new GraphQLTypedMapTypeTypeError(
        `Found unknown fields: ${Array.from(keys.difference(allowedKeys) as unknown as ArrayLike<unknown>).join()}`,
      );
    }
  }
  if(valueType) {
    Object.values(value).forEach(v => valueType.parseValue(v));
  }
  return value;
}

/**
 * Recursively turn arbitrary GraphQL AST object into an object. Returns an plain object.
 */
function _parseObject(typeName: string, ast: ObjectValueNode, variables: unknown): unknown {
  const value = Object.create(null);
  ast.fields.forEach((field) => {
    // eslint-disable-next-line no-use-before-define
    value[field.name.value] = _parseLiteral(typeName, field.value, variables);
  });
  return value;
}


function _parseLiteral(typeName: string, ast: ValueNode, variables: unknown): unknown {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT:
      return _parseObject(typeName, ast, variables);
    case Kind.LIST:
      return ast.values.map((n) => _parseLiteral(typeName, n, variables));
    case Kind.NULL:
      return null;
    case Kind.VARIABLE:
      return variables ? (variables as Record<string, unknown>)[ast.name.value] : undefined;
    default:
      throw new TypeError(`${typeName} cannot represent value: ${print(ast)}`);
  }
}

export const GraphQLTypedMapType = (name = 'GraphQLTypedMapType', allowedKeys?: string[], valueType?: ValueType): GraphQLScalarType => {
  const _allowedKeys: Set<string> | undefined = allowedKeys && new Set(allowedKeys); // eslint-disable-line
  return new GraphQLScalarType({
    name,
    description: `${name} type represents an object with value matching a type and possibly limited set of valid keys`,
    serialize: (value) => ensureObject(value, _allowedKeys, valueType),
    parseValue: (value) => ensureObject(value, _allowedKeys, valueType),
    parseLiteral: (ast, variables) => {
      if (ast.kind !== Kind.OBJECT) {
        throw new GraphQLTypedMapTypeTypeError(
          `${name} cannot represent non-object value: ${print(ast)}`,
        );
      }
      return ensureObject(_parseObject(name, ast, variables), _allowedKeys, valueType);
    },
  });
};
