/**
* タグのサンプルデータ
*/
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

/**
* タグ用のAPI
* 本来はDBや外部APIにアクセスする想定のダミークラス
*/
class TagApi{
  constructor(){
  }

  /**
  * タグの配列の並び替え
  * @param {array} tags タグの配列
  * @return {array} ソートされたタグの配列
  */
  _sort(tags){
    return tags.filter(tag => !!tag)
      .sort((a,b) => a.id - b.id);
  }

  /**
  * タグをすべて返す
  * @return {array} すべてのタグの配列
  */
  all(){
    return this._sort(tags);
  }

  /**
  * IDに紐づくタグを返す
  * @param {number} key タグID
  * @return {object | undefined} IDに紐づくタグ。無ければundefined。
  */
  find(key){
    return tags.find(tag => tag.id == key);
  }

  /**
  * IDのリストに紐づくタグを返す
  * @param {array} keys タグIDの配列
  * @return {array} IDに紐づくタグの配列
  */
  findMany(keys){
    return this._sort(keys.map(key => this.find(key)));
  }

  /**
  * タグを追加する
  * @param {string} name タグ名
  */
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

  /**
  * タグを削除する
  * @param {number} id
  */
  delete(id){
    tags = tags.filter(tag => tag.id != id);
  }
}

module.exports.TagApi = TagApi;
