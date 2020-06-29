import { GraphQLServer } from "graphql-yoga";

// type definitions  >> schema
const typeDefs = `
  type Query {
      title : String!
      price : Float!
      releaseYear : Int
      rating : Float
      inStock : Boolean!
  }
`;

// resolverers
const resolvers = {
  Query: {
    title() {
      return "my product";
    },
    price() {
      return 7.12;
    },
    releaseYear() {
      return 2020;
    },
    rating() {
      return 9.99;
    },
    inStock() {
      return true;
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log("The server is up and running"));
