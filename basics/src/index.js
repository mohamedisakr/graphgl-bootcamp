import { GraphQLServer } from "graphql-yoga";

const users = [
  {
    id: "1",
    name: "Andrew",
    email: "andrew@example.com",
  },
  {
    id: "2",
    name: "Sarah",
    email: "sarah@example.com",
  },
  {
    id: "3",
    name: "Michael",
    email: "michael@example.com",
  },
];

const posts = [
  {
    id: "10",
    title: "GraphQL 101",
    body: "This is how to use GraphQL...",
    published: true,
    author: "1",
  },
  {
    id: "11",
    title: "GraphQL 201",
    body: "This is an advanced GraphQL post...",
    published: false,
    author: "1",
  },
  {
    id: "12",
    title: "Programming Music",
    body:
      "David Cutter Music is my favorite artist to listen to while programming.",
    published: false,
    author: "2",
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
    author : User!
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
  Post: {
    author: (parent, args, ctx, info) => {
      return users.find((user) => user.id === parent.author);
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log("The server is up and running"));
