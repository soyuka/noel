module.exports = {
  from: 'example@gmail.com',
  // See https://nodemailer.com/smtp/ for more information
  nodemailer_smtp: 'smtps://example%40gmail.com:password@smtp.gmail.com',
  //put people here
  people: [
    {
      name: 'Jacques',
      email: 'example@example.com'
    },
    {
      name: 'Tom',
      email: 'example2@example.com'
    },
    {
      name: 'Martha',
      email: 'example3@example.com'
    },
    {
      name: 'Alice',
      email: 'example4@example.com'
    }
  ],
  // Mail configuration
  subject: (person, givesTo) => {
    return `Hey ${person.name}! Christmas info 🎅`
  },
  message: (person, givesTo) => {
    return `
      Hey ${person.name}! For christmas, think about offering a gift to ${givesTo.name}!

      Cheers!
      `
  },
}
