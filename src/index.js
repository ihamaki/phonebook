const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
morgan.token('data', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method, :url, :data, :status, :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))

const getRandom = () => {
  return Math.floor(Math.random() * Math.floor(100000))
}

const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(formatPerson))
    })
    .catch(error => console.log(error))
})

app.get('/api/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.send(
        `<p>puhelinluettelossa on ${persons.length} henkilön tiedot</p>
         <p>${Date()}</p>`
      )
    })
    .catch(error => console.log(error))
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined ||
    body.name.trim() === '' || body.number.trim() === '') {
    return res.status(400).json({ error: 'name or number missing' })
  }

  // if (persons.find(person => person.name === body.name)) {
  //   return res.status(400).json({ error: 'name already in phonebook' })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: getRandom()
  })

  person
    .save()
    .then(savedPerson => {
      res.json(formatPerson(savedPerson))
    })
    .catch(error => console.log(error))
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(formatPerson(person))
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      res.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})