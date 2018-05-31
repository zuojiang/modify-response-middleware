modify-response-middleware
===

Middleware that allows you to modify the response data.

### Installation
```sh
$ npm i modify-response-middleware
```

### Node.js

```js
import express from 'express'
import modifyRes from 'modify-response-middleware'

const app = express()

app.use(modifyRes((content, req, res) => {
  const data = JSON.parse(content.toString())
  data.age += 2
  return Buffer.from(JSON.stringify(data))
}))

app.get((req, res) => {
  res.json({
    name: 'Tom',
    age: 18,
  })
})

app.listen(3000)
```

### License

MIT
