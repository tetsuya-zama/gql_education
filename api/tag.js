
let tags = [
  {
    id: 1,
    name: "プライベート"
  },
  {
    id: 2,
    name: "仕事"
  },
  {
    id: 3,
    name: "楽しい"
  },
  {
    id: 4,
    name: "めんどくさい"
  }
];

class TagApi{
  constructor(){
  }

  _sort(tags){
    return tags.filter(tag => !!tag)
      .sort((a,b) => a.id - b.id);
  }

  all(){
    return this._sort(tags);
  }

  find(key){
    return tags.find(tag => tag.id == key);
  }

  findMany(keys){
    return this._sort(keys.map(key => this.find(key)));
  }

  add(name){
    if(!tags.find(tag => tag.name == name)){
      tags = tags.concat([
        {
          id: Math.max(...tags.map(tag => tag.id)) + 1,
          name
        }
      ]);
    }
  }

  delete(id){
    tags = tags.filter(tag => tag.id != id);
  }
}

module.exports.TagApi = TagApi;
