const { GraphQLServer } = require("graphql-yoga");
const cookieParser = require("cookie-parser");
const db = require("../lib/db");

const path = require("path");
const jwt = require("jsonwebtoken");

const Mutation = require("../resolvers/mutation");
const Query = require("../resolvers/query");

const server = new GraphQLServer({
  typeDefs: path.join(__dirname, "../", "compiled-schema.graphql"),
  resolvers: {
    Mutation,
    Query
  },
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  context: req => {
    return { ...req, db };
  }
});

server.express.use(cookieParser());

server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.PRISMA_SECRET);
    req.userId = userId;
  }
  next();
});

server.start(
  {
    endpoint: "/api/graphql",
    playground: "/api/graphql"
  },
  info => console.log({ info })
);
