# gql_education

## 概要
GraphQL教育用のサンプルコンテンツです

## 起動方法

```bash
$ git clone https://github.com/tetsuya-zama/gql_education.git
$ cd gql_education
$ npm install
$ node index.js # http://localhost:4000にGraphiQLが起動する
```

### 使用するポートを変更したい場合

index.jsのserver.listen()の引数にポート番号を指定することで変更可能です。

```js
//8080で起動する場合
server.listen(8080).then(({url}) => console.log(`server listen at ${url}`));
```
