let tasks = [
  {
    id:1,
    name: "牛乳を買う",
    done: false,
    tagIds: [1]
  },
  {
    id:2,
    name: "DataLoaderを試す",
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
    name:"ApolloServerのn+1問題を検証する",
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

class TaskApi {
  constructor(){
  }

  _sort(tasks){
    return tasks.filter(task => !!task)
      .sort((a,b) => a.id - b.id);
  }

  all(){
    return this._sort(tasks);
  }

  find(key){
    return tasks.find(task => task.id == key);
  }

  findMany(keys){
    return this._sort(keys.map(key => this.find(key)));
  }

  put(task){
    if(!task.id){
      task.id = Math.max(...tasks.map(task => task.id)) + 1;
    }

    tasks = tasks.filter(t => t.id != task.id).concat([task]);

    return this.find(task.id);
  }

  delete(id){
    tasks = tasks.filter(task => task.id != id);
  }
}

module.exports.TaskApi = TaskApi;
