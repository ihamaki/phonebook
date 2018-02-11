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

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(Person.format))
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

  const person = new Person({
    name: body.name,
    number: body.number,
    id: getRandom()
  })

  person
    .save()
    .then(savedPerson => {
      res.json(Person.format(savedPerson))
    })
    .catch(error => console.log(error))
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(Person.format(person))
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

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(Person.format(updatedPerson))
    })
    .catch(error => {
      res.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})