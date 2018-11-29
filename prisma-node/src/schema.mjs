export const typeDefs = `
type Query {
  users(query: String): [User!]!
  posts(query: String): [Post!]!
  myPosts(query: String): [Post!]!
  me: User!
  comments:[Comment!]!
  post(id: ID!): Post!
}

type Mutation {
  createUser(data: CreateUserInput): AuthPayload!
  login(data: LoginInput): AuthPayload!
  deleteUser:User!
  updateUser(data: UpdateUserInput!): User!
  createPost(data: CreatePostInput): Post!
  deletePost(id: ID!):Post!
  updatePost(id: ID!, data: UpdatePostInput!): Post!
  createComment(data: CreateCommentInput): Comment!
  deleteComment(id:ID!): Comment!
  updateComment(id: ID!, data: UpdateCommentInput!): Comment
}

type Subscription {
  comment(postId: ID!): CommentSubscriptionPayload!
  post: PostSubscriptionPayload!
}

type AuthPayload {
  token: String!
  user: User!
}

input LoginInput {
  email: String!
  password: String!
}

input CreateUserInput {
  name: String!
  email: String!
  password: String!
}
input UpdateUserInput {
  name: String
  email: String
}

input CreatePostInput {
  title: String!
  body: String!
  published: Boolean!
}
input UpdatePostInput {
  title: String
  body: String
  published: Boolean
}
input CreateCommentInput {
  text: String!
  post: ID!
}
input UpdateCommentInput {
  text: String
}

type User {
  id: ID!
  name: String!
  email: String!
  password: String!
  posts: [Post!]!
  comments: [Comment!]!
}
type Post {
  id: ID!
  title: String!
  body: String!
  published: Boolean!
  author: User!
  comments: [Comment!]!
}
type Comment {
  id: ID!
  text: String!
  author: User!
  post: Post!
}
enum MutationType {
  CREATED
  UPDATED
  DELETED
}

type PostSubscriptionPayload {
  mutation: MutationType!
  node: Post
}
type CommentSubscriptionPayload {
  mutation: MutationType!
  node: Comment
}

`
