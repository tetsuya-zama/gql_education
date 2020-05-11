const DataLoader =  require('dataloader');
const {TagApi} = require('./api/tag');
const {TaskApi} = require('./api/task');

module.exports.createDataSources = () =>{
  const tagApi = new TagApi();
  const taskApi = new TaskApi();

  const tagIdLoader = new DataLoader(async(keys) => {
    const tags = tagApi.findMany(keys);
    return keys.map(key => tags.find(tag => tag.id == key) || null);
  });

  const tagNameLoader = new DataLoader(async(keys) => {
    const tags = tagApi.all();
    return keys.map(key => tags.find(tag => tag.name == key) || null);
  });

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

module.exports.resolvers = {
  Query: {
    tasksAll: async(_,__,{dataSources}) => dataSources.taskApi.all() ,
    tasksByTagName: async(_,{tagName},{dataSources}) => {
      const tag = await dataSources.tagNameLoader.load(tagName);
      if(!tag) return [];

      const tasks = dataSources.taskApi.all();

      return tasks.filter(task => task.tagIds.includes(tag.id));
    },
    taskById: async(_,{id},{dataSources}) => dataSources.taskIdLoader.load(id),
    tagsAll: async(_,__,{dataSources}) => dataSources.tagApi.all(),
    tagById: async(_,{id},{dataSources}) => dataSources.tagIdLoader.load(id),
    tagByName: async(_,{name},{dataSources}) => dataSources.tagNameLoader.load(name)
  },
  Task:{
    tags: async(task, _, {dataSources}) => dataSources.tagIdLoader.loadMany(task.tagIds)
  },
  Mutation:{
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
