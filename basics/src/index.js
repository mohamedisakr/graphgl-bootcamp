import { GraphQLServer } from "graphql-yoga";

const users = [
  {
    id: "7dbf629f-7ab3-467a-a9b6-6caccbc6c72e",
    name: "Andrew",
    email: "andrew@example.com",
  },
  {
    id: "a68c2a52-41ad-4595-b412-48006378cb91",
    name: "Sarah",
    email: "sarah@example.com",
  },
  {
    id: "061ef0d3-f13f-4c68-badf-e1379e3feef7",
    name: "Michael",
    email: "michael@example.com",
  },
];

const posts = [
  {
    id: "83c00037-edf0-4676-8ce6-2b890175519b",
    title: "GraphQL 101",
    body: "This is how to use GraphQL...",
    published: true,
  },
  {
    id: "8947b535-c36c-4cc3-8851-64283065b995",
    title: "GraphQL 201",
    body: "This is an advanced GraphQL post...",
    published: false,
  },
  {
    id: "5998f660-06f6-4eeb-a5b3-cf637105cf6a",
    title: "Programming Music",
    body:
      "David Cutter Music is my favorite artist to listen to while programming.",
    published: false,
  },
];
// type definitions  >> schema
const typeDefs = `
  type Query {
      users(query: String) : [User!]!
      posts(query: String) : [Post!]!
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
    users: (_, { query }) => {
      if (!query) {
        return users;
      }
      return users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
    },
    posts: (_, { query }) => {
      if (!query) {
        return posts;
      }
      return posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.body.toLowerCase().includes(query.toLowerCase())
      );
    },
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
