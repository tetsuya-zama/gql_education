const {gql} = require("apollo-server");

module.exports.typeDefs = gql`
"""
タグ
"""
type Tag{
  id: ID!
  name: String!
}
"""
タスク
"""
type Task{
  id: ID!
  name: String!
  done: Boolean!
  tags: [Tag!]!
}

type Query{
  tasksAll: [Task!]!
  tasksByTagName(tagName: String): [Task!]!
  taskById(id: ID!): Task
  tagsAll: [Tag!]!
  tagById(id: ID!): Tag
  tagByName(name: String!): Tag
}

type Error{
  message: String!
}

type TaskMutationResult{
  error: Error
  task: Task
}

type Mutation{
  taskNew(name: String!, tagNames: [String!]!): TaskMutationResult!
  taskModify(id: ID!, name: String!, tagNames: [String!]!):TaskMutationResult!
  taskToggle(id: ID!): TaskMutationResult!
  taskDelete(id: ID!): TaskMutationResult!
}


`;
