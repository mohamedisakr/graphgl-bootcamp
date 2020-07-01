import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from "uuid"; // import uuidv4 from "uuid";

let users = [
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

let posts = [
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

let comments = [
  {
    id: "1",
    text: "Thanks! Super useful post.",
    author: "1",
    post: "10",
  },
  {
    id: "2",
    text: "Could not agree more!",
    author: "1",
    post: "10",
  },
  {
    id: "3",
    text: "awosome keep going!",
    author: "2",
    post: "11",
  },
  {
    id: "4",
    text: "you are the best!",
    author: "3",
    post: "12",
  },
];

// type definitions  >> schema
const typeDefs = `
  type Query {
      users(query: String) : [User!]!
      posts(query: String) : [Post!]!
      comments(query: String) : [Comment!]!
      me : User!  
      post : Post!    
  }

  type Mutation {
    createUser(user : CreateUserInput!) : User!
    deleteUser(id : ID!) : User!
    
    createPost(post : CreatePostInput!) : Post!
    deletePost(id : ID!) : Post!
        
    createComment(comment : CreateCommentInput!) : Comment!
    deleteComment(id : ID!) : Comment!
  }
 
  input CreateUserInput {
    name : String!, email: String!, age : Int
  }

  input CreatePostInput {
    title : String!, body: String!, published : Boolean!, author:ID!
  }

  input CreateCommentInput {
    text : String!, author : ID!, post : ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean
    author : User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author : User!
    post : Post!
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
    comments: (_, { query }) => {
      if (!query) {
        return comments;
      }
      return comments.filter((comment) =>
        comment.text.toLowerCase().includes(query.toLowerCase())
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
  Mutation: {
    createUser: (parent, args, ctx, info) => {
      const { name, email, age } = args.user;
      const emailTaken = users.some((user) => user.email === args.email);
      if (emailTaken) {
        throw new Error("Email taken");
      }

      const user = { id: uuidv4(), name, email, age };
      users.push(user);
      return user;
    },

    deleteUser: (parent, args, ctx, info) => {
      const index = users.findIndex((user) => user.id === args.id);
      if (index === -1) {
        throw new Error("User not found");
      }
      const deletedUsers = users.splice(index, 1);
      posts = posts.filter((post) => {
        const match = post.author !== args.id;
        if (match) {
          comments = comments.filter((comment) => comment.post !== post.id);
        }
        return !match;
      });
      comments = comments.filter((comment) => comment.author !== args.id);
      return deletedUsers[0];
    },

    deletePost: (parent, args, ctx, info) => {
      const index = posts.findIndex((post) => post.id === args.id);
      if (index === -1) {
        throw new Error("Post not found");
      }
      const deletedPosts = posts.splice(index, 1);
      comments = comments.filter((comment) => comment.post !== args.id);
      return deletedPosts[0];
    },

    createPost: (parent, args, ctx, info) => {
      const { title, body, published, author } = args.post;
      const userExist = users.some((user) => user.id === author);
      if (!userExist) {
        throw new Error("User not fount");
      }
      const post = { id: uuidv4(), title, body, published, author };
      posts.push(post);
      return post;
    },

    createComment: (parent, args, ctx, info) => {
      const { text, author, post } = args.comment;

      const userExist = users.some((user) => user.id === author);
      if (!userExist) {
        throw new Error("User not fount");
      }

      const postExist = posts.some(
        (thePost) => thePost.id === post && thePost.published
      );
      if (!postExist) {
        throw new Error("Post not fount");
      }

      const comment = { id: uuidv4(), text, author, post };
      comments.push(comment);
      return comment;
    },

    deleteComment: (parent, args, ctx, info) => {
      const index = comments.findIndex((comment) => comment.id === args.id);
      if (index === -1) {
        throw new Error("Comment not found");
      }
      const deletedComments = comments.splice(index, 1);
      return deletedComments[0];
    },
  },
  Post: {
    author: (parent, args, ctx, info) => {
      return users.find((user) => user.id === parent.author);
    },
    comments: (parent, args, ctx, info) => {
      return comments.filter((comment) => comment.post === parent.id);
    },
  },
  User: {
    posts: (parent, args, ctx, info) => {
      return posts.filter((post) => post.author === parent.id);
    },
    comments: (parent, args, ctx, info) => {
      return comments.filter((comment) => comment.author === parent.id);
    },
  },
  Comment: {
    author: (parent, args, ctx, info) => {
      return users.find((user) => user.id === parent.author);
    },
    post: (parent, args, ctx, info) => {
      return posts.find((post) => post.id === parent.post);
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log("The server is up and running"));
