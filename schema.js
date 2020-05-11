const {gql} = require("apollo-server");

module.exports.typeDefs = gql`
"""
タグ
"""
type Tag{
  """
  タグID(自動生成)
  """
  id: ID!
  """
  タグ名
  """
  name: String!
}
"""
タスク
"""
type Task{
  """
  タスクID(自動生成)
  """
  id: ID!
  """
  タスク名
  """
  name: String!
  """
  完了フラグ
  """
  done: Boolean!
  """
  タグ
  """
  tags: [Tag!]!
}

type Query{
  """
  タスクをすべて取得
  """
  tasksAll: [Task!]!
  """
  タグに紐づくタスクを取得
  """
  tasksByTagName(tagName: String): [Task!]!
  """
  IDからタスクを取得
  """
  taskById(id: ID!): Task
  """
  タグをすべて取得
  """
  tagsAll: [Tag!]!
  """
  IDからタグを取得
  """
  tagById(id: ID!): Tag
  """
  タグ名からタグを取得
  """
  tagByName(name: String!): Tag
}

"""
Mutationの実行エラー
"""
type Error{
  """
  エラーメッセージ
  """
  message: String!
}

"""
Taskに関するMutationの実行結果
"""
type TaskMutationResult{
  """
  error(無ければNull)
  """
  error: Error
  """
  実行後の対象タスク（無ければNull)
  """
  task: Task
}

type Mutation{
  """
  新しいタスクを作成する
  """
  taskNew(
    """
    タスク名
    """
    name: String!,
    """
    紐づけるタグ名
    """
    tagNames: [String!]!
  ): TaskMutationResult!
  """
  タスク情報を修正する
  """
  taskModify(
    """
    対象のタスクID
    """
    id: ID!,
    """
    更新後のタスク名
    """
    name: String!,
    """
    更新後のタグ名
    """
    tagNames: [String!]!
  ):TaskMutationResult!
  """
  タスクの完了/未完了を切り替える
  """
  taskToggle(
    """
    対象のタスクID
    """
    id: ID!
  ):TaskMutationResult!
  """
  タスクを削除する
  """
  taskDelete(
    """
    対象のタスクID
    """
    id: ID!
  ): TaskMutationResult!
}


`;
