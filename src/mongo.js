const mongoose = require('mongoose')

const url = ''

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv[2] && process.argv[3]) {
  const newName = process.argv[2]
  const newNumber = process.argv[3]

  const person = new Person({
    name: newName,
    number: newNumber
  })

  person
    .save()
    .then(result => {
      console.log(`adding new person ${newName} with number ${newNumber} to the list`)
      mongoose.connection.close()
    })
} else {
  Person
    .find({})
    .then(result => {
      console.log('puhelinluettelo:')
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
}