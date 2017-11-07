const fastify = require('fastify')()
const data = `${__dirname}/data`
const {decrypt} = require('./crypt')
const fs = require('fs')
const body = function (content) {
  return `
<html>
<head>
<meta charset="utf-8">
</head>
<body>
  ${content}
</body>
</html>
`
}

// Declare a route
fastify.get('/', async function (request, reply) {
  reply.type('text/html').code(200)
  return body`
<form method="GET" action="/open">
  <input type="text" name="email">
  <button type="submit">Ouvrir</button>
</form>
`
})

async function getFileContent(path, email) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, function(err, str) {
      fs.unlink(path, function(err) {
        resolve(body(`<p>${decrypt(str.toString(), email)}</p><small>Ce message s'est auto-détruit.</small>`))
     })
    })
  })
}

// Declare a route
fastify.get('/open', async function (request, reply) {
  const email = request.query.email
  const path = `${data}/${email}`

  if (!fs.existsSync(path)) {
    reply.type('text/html').code(404)
    return `Not found`
  }

  reply.type('text/html').code(200)

  return await getFileContent(path, email)
})

// Run the server!
fastify.listen(3000, function (err) {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
