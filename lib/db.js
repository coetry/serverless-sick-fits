const { Prisma } = require("prisma-binding");
const path = require("path");

const db = new Prisma({
  typeDefs: path.join(__dirname, "..", "generated", "prisma.graphql"),
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: process.env.NODE_ENV === "development" ? true : false
});

module.exports = db;
