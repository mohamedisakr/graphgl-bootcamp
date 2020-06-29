import { GraphQLServer } from "graphql-yoga";

// type definitions  >> schema
const typeDefs = `
  type Query {
      me : User!  
      post : Post!    
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean
  }
`;

// resolverers
const resolvers = {
  Query: {
    me() {
      return {
        id: "1234789",
        name: "Mohamed Hassan",
        email: "breaded@breaded.com",
        age: 21,
      };
    },
    post() {
      return {
        id: "12347890",
        title: "GraphQL is awosome",
        body: "GraphQL is awosome, you have to go to this wander land",
        published: true,
      };
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log("The server is up and running"));
