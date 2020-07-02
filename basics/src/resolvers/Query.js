const Query = {
  users: (_, { query }) => {
    const { users } = db;
    if (!query) {
      return users;
    }
    return users.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
  },
  posts: (_, { query }) => {
    const { posts } = db;
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
    const { comments } = db;
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
};

export { Query as default };
