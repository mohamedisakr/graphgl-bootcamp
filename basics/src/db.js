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

const db = { users, posts, comments };

export { db as default };
