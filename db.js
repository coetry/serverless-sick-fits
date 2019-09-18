const { Prisma } = require("prisma-binding");
const path = require("path");

console.log({ endpoint: process.env.PRISMA_ENDPOINT });

const db = new Prisma({
  typeDefs: path.resolve(
    path.join(process.cwd(), "generated", "prisma.graphql")
  ),
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: true
});

module.exports = db;
