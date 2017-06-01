const util = require('util')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const fs = require('fs')

const config = require('./config.js')
const debug = !~process.argv.indexOf('send')
const verbose = ~process.argv.indexOf('-v')

const transporter = nodemailer.createTransport(config.smtp)
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

  const mailOptions = {
    from: config.from,
    to: person.email,
    subject: config.subject(person, givesTo),
    html: config.message(person, givesTo)
  }

  promises.push(new Promise((resolve, reject) => {
    if (!debug) {
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) { return reject(error) }
        resolve(info)
      })
      return
    }


    if (verbose) {
      console.log(`
  From: ${mailOptions.from}
  To: ${mailOptions.to}
  Subject: ${mailOptions.subject}
  Message:
        ${mailOptions.html}
==================================================`)
      resolve()
    } else {
      resolve()
    }
  }))
}

Promise.all(promises)
.then(function() {
  if (!debug) {
    console.log('All sent!');
  } else {
    for (let i in results) {
      console.log(`${i} => ${results[i]}`)
    }
  }

  process.exit(0)
})
.catch(function(err) {
  console.log('Whoops, an error occured!')
  console.log(err);
  process.exit(1)
})
