const util = require('util')
const fs = require('fs')

const config = require('./config.js')
const verbose = ~process.argv.indexOf('-v')
const {crypt} = require('./crypt')

const people = config.people

function compute () {
  const results = {}
  const choices = [...people].map(e => e.name)

  for (let i = 0, len = choices.length; i < len; i++) {
    const person = people[i]
    let filtered = choices.filter(e => e !== person.name)
    let index = Math.floor(Math.random() * filtered.length);

    //there is a probability the last one is itself
    if (filtered.length === 0 && i === people.length - 1) {
      return compute()
    }

    results[person.name] = filtered[index];

    choices.splice(choices.findIndex(e => e === filtered[index]), 1)
  }

  return results
}

const results = compute()
const promises = []

for(let i in results) {
  const person = people.find(e => e.name === i)
  const givesTo = people.find(e => e.name === results[i])
  const message = config.message(person, givesTo)

  promises.push(new Promise((resolve, reject) => {
    if (verbose) {
      console.log(person, message)
    }

    fs.writeFile(`./data/${person.email}`, crypt(message, person.email), function (err) {
      if (err) {
        reject(err)
        return
      }

      resolve()
    })
  }))
}

Promise.all(promises)
.then(function() {
  process.exit(0)
})
.catch(function(err) {
  console.log('Whoops, an error occured!')
  console.log(err);
  process.exit(1)
})
