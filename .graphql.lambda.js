const { GraphQLServerLambda } = require("graphql-yoga");
const path = require("path");
const db = require("./db");

const Mutation = require("./resolvers/mutation");
const Query = require("./resolvers/query");

const lambda = new GraphQLServerLambda({
  typeDefs: path.join(process.cwd(), "schema.graphql"),
  resolvers: {
    Mutation,
    Query
  },
  cors: {
    origin: "*",
    credentials: true
  },
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  context: req => {
    console.log({ context: req });
    return { ...req, db };
  },
  playground: "/api/playground",
  endpoint: "/api/graphql"
});

exports.handler = lambda.handler;

/*
exports.handler = function(event, context, callback) {
}
*/
