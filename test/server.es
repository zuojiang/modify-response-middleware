import express from 'express'
import proxy from 'http-proxy-middleware'
import modifyRes from '../src/index.es'
import jsonServer from 'json-server'

const app = express()

app.use(modifyRes((content, req, res) => {
  console.log(req.url);
  console.log(content.toString());
  return content
}))

app.get('/test1', modifyRes((content, req, res) => {
  try {
    const data = JSON.parse(content.toString())
    data.age += 2
    return Buffer.from(JSON.stringify(data))
  } catch (e) {
    console.error(e);
  }
}), (req, res) => {
  res.json({
    name: 'Tom',
    age: 18,
  })
})

app.use('/test2', modifyRes((content, req, res) => {
  console.log(content)
}, {
  noCache: true,
}), jsonServer.router({
  "posts": [
    { "id": 1, "title": "json-server", "author": "typicode" }
  ],
}))

app.use(proxy({
  target: 'https://github.com/zuojiang/modify-response-middleware',
  changeOrigin: true,
}))

app.listen(3000)
