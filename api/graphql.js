const { GraphQLServer } = require("graphql-yoga");
const cookieParser = require("cookie-parser");
const db = require("../db");

const path = require("path");
const jwt = require("jsonwebtoken");

const Mutation = require("../resolvers/mutation");
const Query = require("../resolvers/query");

const server = new GraphQLServer({
  typeDefs: path.join(__dirname, "_typedefs.graphql"),
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
    return { ...req, db };
  },
  playground: "/api/graphl",
  endpoint: "/api/graphql"
});

server.express.use(cookieParser());

server.express.use((req, res, next) => {
  console.log({ secret: process.env.PRISMA_SECRET });
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.PRISMA_SECRET);
    req.userId = userId;
  }
  /*
  if (req.headers.cookie) {
    console.log({ cookie });
    const token = req.headers.cookie
      .split(";")
      .filter(c => c.includes("token"))[0]
      .split("=")[1];
    console.log({ token });
    if (token) {
      const { userId } = jwt.verify(token, process.env.APP_SECRET);
      // put userId onto req
      req.userId = userId;
    }
  }
  */
  next();
});

server.start(
  {
    endpoint: "/api/graphql",
    playground: "/api/graphql"
  },
  info => console.log({ info })
);

/*
server.start(
  {
    cors: {
      origin: "http://localhost:3000",
      credentials: true
    }
  },
  info => {
    console.log(`server running on ${info.port}`);
  }
);
*/
