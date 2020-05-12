const DataLoader =  require('dataloader');
const {TagApi} = require('./api/tag');
const {TaskApi} = require('./api/task');

/**
* resolverが参照するデータソースを初期化する関数
* @return {object} データソース
*/
module.exports.createDataSources = () =>{
  const tagApi = new TagApi(); //タグ用API
  const taskApi = new TaskApi(); //タスク用API

  /**
  * いわゆるn+1問題による参照リソース負荷を避けるため、
  * 特定のkeyによる参照についてはDataLoaderでwrapする
  * ※ダミーAPIなので事実上意味無いが、APIがDBや外部APIを参照している想定
  */

  //IDをkeyにタグを参照するDataloader
  const tagIdLoader = new DataLoader(async(keys) => {
    const tags = tagApi.findMany(keys);
    return keys.map(key => tags.find(tag => tag.id == key) || null);
  });

  //nameをkeyにタグを参照するDataLoader
  const tagNameLoader = new DataLoader(async(keys) => {
    const tags = tagApi.all();
    return keys.map(key => tags.find(tag => tag.name == key) || null);
  });

  //idをkeyにタスクを参照するDataLoader
  const taskIdLoader = new DataLoader(async(keys) => {
    const tasks = taskApi.findMany(keys);
    return keys.map(key => tasks.find(task => task.id == key) || null);
  })

  return {
    tagApi,
    taskApi,
    tagIdLoader,
    tagNameLoader,
    taskIdLoader
  }
};

/**
* GraphQLのresolver
* 第１引数 親ノードが解決した結果
* 第２引数 引数として与えられたパラメータ
* 第３引数 コンテクスト
*/
module.exports.resolvers = {
  Query: {
    //タスクをすべて取得
    tasksAll: async(_,__,{dataSources}) => dataSources.taskApi.all() ,
    //タグ名からタスクを取得
    tasksByTagName: async(_,{tagName},{dataSources}) => {
      const tag = await dataSources.tagNameLoader.load(tagName);
      if(!tag) return [];

      const tasks = dataSources.taskApi.all();

      return tasks.filter(task => task.tagIds.includes(tag.id));
    },
    //IDからタスクを取得
    taskById: async(_,{id},{dataSources}) => dataSources.taskIdLoader.load(id),
    //タグをすべて取得
    tagsAll: async(_,__,{dataSources}) => dataSources.tagApi.all(),
    //IDからタグを取得
    tagById: async(_,{id},{dataSources}) => dataSources.tagIdLoader.load(id),
    //名前からタグを取得
    tagByName: async(_,{name},{dataSources}) => dataSources.tagNameLoader.load(name)
  },
  Task:{
    /**
    * 親ノードが解決した"Task"を元にTask#tagsを解決する
    * このようにGraph上の親子関係にしたがって連鎖的に解決できる点がポイント
    */
    tags: async(task, _, {dataSources}) => dataSources.tagIdLoader.loadMany(task.tagIds)
  },
  Mutation:{
    /**
    * タスクを作成する
    */
    taskNew: async(_, {name, tagNames}, {dataSources}) => {
      for(tagName of tagNames){
        const existTag = await dataSources.tagNameLoader.load(tagName);
        if(!existTag){
          dataSources.tagApi.add(tagName);
          await dataSources.tagNameLoader.clear(tagName);
        }
      }

      const tags = await dataSources.tagNameLoader.loadMany(tagNames)
      const tagIds = tags.map(tag => tag.id);


      try{
        const result = dataSources.taskApi.put({
          name,
          done: false,
          tagIds
        });

        return {task: result};
      }catch(e){
        return {error: {message:e.message}};
      }

    },
    /**
    * タスクを更新する
    */
    taskModify: async(_, {id, name, tagNames}, {dataSources}) => {
      const targetTask = await dataSources.taskIdLoader.load(id);

      if(!targetTask) return {error: {message:`Task:${id} does not exist`}};

      for(tagName of tagNames){
        const existTag = await dataSources.tagNameLoader.load(tagName);
        if(!existTag){
          dataSources.tagApi.add(tagName);
          await dataSources.tagNameLoader.clear(tagName);
        }
      }

      const tags = await dataSources.tagNameLoader.loadMany(tagNames)
      const tagIds = tags.map(tag => tag.id);


      try{
        const result = dataSources.taskApi.put({
          id,
          name,
          done: targetTask.done,
          tagIds
        });
        await dataSources.taskIdLoader.clear(result.id);
        return {task: result};
      }catch(e){
        return {error: {message:e.message}};
      }
    },
    /**
    * タスクの完了/未完了を切り替える
    */
    taskToggle: async(_ ,{id}, {dataSources}) =>{
      const targetTask = await dataSources.taskIdLoader.load(id);

      if(!targetTask) return {error: {message:`Task:${id} does not exist`}};

      try{
        targetTask.done = !targetTask.done;
        const result = dataSources.taskApi.put(targetTask);
        await dataSources.taskIdLoader.clear(result.id);
        return {task:result}
      }catch(e){
        return {error: {message:e.message}};
      }
    },
    /**
    * タスクを削除する
    */
    taskDelete: async(_,{id},{dataSources}) => {
      const targetTask = await dataSources.taskIdLoader.load(id);

      if(!targetTask) return {error: {message:`Task:${id} does not exist`}};

      try{
        dataSources.taskApi.delete(id);
        await dataSources.taskIdLoader.clear(id);
        return {};
      }catch(e){
        return {error: {message:e.message}};
      }
    }
  }
}
