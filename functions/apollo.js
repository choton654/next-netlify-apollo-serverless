const { ApolloServer } = require("apollo-server-lambda");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("err", (err) => console.log(err));
db.once("open", () => console.log("we are connected"));

const typeDefs = require("../graphql/typedefs");
const resolvers = require("../graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context }) => ({ event, context }),
});

module.exports.handler = server.createHandler();

// server.applyMiddleware({ app });
// const { ApolloServer, gql } = require("apollo-server-express");
// const serverless = require("serverless-http");
// const express = require("express");

// const app = express();
// const router = express.Router();

// router.get("/", (req, res) => {
//   res.end("hello");
// });

// app.use("/.netlify/functions/apollo-graphql", router);
// module.exports.handler = serverless(app);
