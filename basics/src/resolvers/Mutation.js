import { v4 as uuidv4 } from "uuid";
import { PubSub } from "graphql-yoga";

const Mutation = {
  createUser: (parent, args, ctx, info) => {
    const { users } = ctx.db;
    const { name, email, age } = args.user;
    const emailTaken = users.some((user) => user.email === args.email);
    if (emailTaken) {
      throw new Error("Email taken");
    }

    const user = { id: uuidv4(), name, email, age };
    users.push(user);
    return user;
  },

  updateUser: (parent, args, ctx, info) => {
    const { id, userToUpdate } = args;
    const { users } = ctx.db;
    const user = users.find((user) => user.id === id);

    if (!user) {
      throw new Error("User not found");
    }

    if (typeof userToUpdate.email === "string") {
      const emailTaken = users.some(
        (user) => user.email === userToUpdate.email
      );
      if (emailTaken) {
        throw new Error("Email already exist");
      }
      user.email = userToUpdate.email;
    }

    if (typeof userToUpdate.name === "string") {
      user.name = userToUpdate.name;
    }

    if (typeof userToUpdate.age !== "undefined") {
      user.age = userToUpdate.age;
    }

    return user;
  },

  deleteUser: (parent, args, ctx, info) => {
    let { users, posts, comments } = ctx.db;
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
    let { posts, comments } = ctx.db;
    const index = posts.findIndex((post) => post.id === args.id);
    if (index === -1) {
      throw new Error("Post not found");
    }
    const deletedPosts = posts.splice(index, 1);
    comments = comments.filter((comment) => comment.post !== args.id);
    return deletedPosts[0];
  },

  createPost: (parent, args, ctx, info) => {
    const { posts } = ctx.db;
    const { title, body, published, author } = args.post;
    const userExist = users.some((user) => user.id === author);
    if (!userExist) {
      throw new Error("User not fount");
    }
    const post = { id: uuidv4(), title, body, published, author };
    posts.push(post);
    return post;
  },

  updatePost: (parent, args, ctx, info) => {
    let { id, postToUpdate } = args;
    const { posts } = ctx.db;
    const post = posts.find((post) => post.id === id);

    if (!post) {
      throw new Error("Post not found");
    }

    if (!postToUpdate.title) {
      throw new Error("Post title required");
    }
    if (typeof postToUpdate.title === "string") {
      post.title = postToUpdate.title;
    }

    if (typeof postToUpdate.body === "string") {
      post.body = postToUpdate.body;
    }

    if (typeof post.published === "boolean") {
      post.published = postToUpdate.published;
    }
    return post;
  },

  createComment: (parent, args, { db, pubsub }, info) => {
    const { users, posts, comments } = db;
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
    pubsub.publish(`comment ${post}`, { comment });
    return comment;
  },

  updateComment: (parent, args, ctx, info) => {
    const { id, commentToUpdate } = args;
    const { comments } = ctx.db;

    const comment = comments.find((comment) => comment.id === id);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (typeof commentToUpdate.text === "string") {
      comment.text = commentToUpdate.text;
    }

    return comment;
  },

  deleteComment: (parent, args, ctx, info) => {
    const { comments } = ctx.db;
    const index = comments.findIndex((comment) => comment.id === args.id);
    if (index === -1) {
      throw new Error("Comment not found");
    }
    const deletedComments = comments.splice(index, 1);
    return deletedComments[0];
  },
};

export { Mutation as default };
