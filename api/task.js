/**
* タスクのサンプルデータ
*/
let tasks = [
  {
    id:1,
    name: "牛乳を買う",
    done: false,
    tagIds: [1]
  },
  {
    id:2,
    name: "ApolloServerのサンプルを作る",
    done: true,
    tagIds: [2,3]
  },
  {
    id:3,
    name: "部屋を掃除する",
    done: false,
    tagIds: [1,4]
  },
  {
    id:4,
    name:"GraphQLの勉強会をする",
    done: false,
    tagIds: [2,3]
  },
  {
    id:5,
    name:"ベース練習する",
    done: true,
    tagIds:[1,3,4]
  }
];

/**
* タスク用のAPI
* 本来はDBや外部APIにアクセスする想定のダミークラス
*/
class TaskApi {
  constructor(){
  }

  /**
  * タスクの配列の並び替え
  * @param {array} tasks タスクの配列
  * @param {array} 並び替えられたタスクの配列
  */
  _sort(tasks){
    return tasks.filter(task => !!task)
      .sort((a,b) => a.id - b.id);
  }

  /**
  * すべてのタスクを返す
  * @return {array} すべてのタスクの配列
  */
  all(){
    return this._sort(tasks);
  }

  /**
  * IDに紐づくタスクを返す
  * @param {number} key タスクID
  * @return {object | undefined } IDに紐づくタスク。無ければundefined。
  */
  find(key){
    return tasks.find(task => task.id == key);
  }

  /**
  * IDの配列に紐づくタスクを返す
  * @param {array} keys タスクIDの配列
  * @return {array} タスクの配列
  */
  findMany(keys){
    return this._sort(keys.map(key => this.find(key)));
  }

  /**
  * タスクを追加・更新する
  * @param {object} 更新するTask。idが無ければ追加、あれば更新
  * @return {object} 追加/更新されたTask
  */
  put(task){
    if(!task.id){
      task.id = Math.max(...tasks.map(task => task.id)) + 1;
    }

    tasks = tasks.filter(t => t.id != task.id).concat([task]);

    return this.find(task.id);
  }

  /**
  * タスクを削除する
  * @param {number} id 削除するタスクID
  */
  delete(id){
    tasks = tasks.filter(task => task.id != id);
  }
}

module.exports.TaskApi = TaskApi;
