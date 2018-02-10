const mongoose = require('mongoose')

const url = 'mongodb://fullstack:coolcool@ds129428.mlab.com:29428/phonebook'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

module.exports = Person