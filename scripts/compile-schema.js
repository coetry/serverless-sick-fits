// graphql-import, generate schema and write to output at build time

const { importSchema } = require("graphql-import");
const { writeFile } = require("fs");
const { join } = require("path");

const typeDefs = importSchema(join(__dirname, "..", "schema.graphql"));

writeFile(join(__dirname, "..", "compiled-schema.graphql"), typeDefs, err => {
  if (err) throw err;
});
