import { v4 as uuidv4 } from "uuid";

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

  createComment: (parent, args, ctx, info) => {
    const { users, posts, comments } = ctx.db;
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
