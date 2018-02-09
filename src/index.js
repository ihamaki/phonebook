const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
morgan.token('data', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method, :url, :data, :status, :res[content-length] - :response-time ms'))
app.use(cors())

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Martti Tienari",
    number: "040-123456",
    id: 2
  },
  {
    name: "Arto Järvinen",
    number: "040-123456",
    id: 3
  },
  {
    name: "Lea Kutvonen",
    number: "040-123456",
    id: 4
  }
]

const generateInfo = () => {
  return (
    `<p>puhelinluettelossa on ${persons.length} henkilön tiedot</p>
     <p>${Date()}</p>`
  )
}

const getRandom = () => {
  return Math.floor(Math.random() * Math.floor(100000))
}

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/info', (req, res) => {
  const info = generateInfo()
  res.send(info)
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined ||
    body.name.trim() === '' || body.number.trim() === '') {
    return res.status(400).json({ error: 'name or number missing' })
  }

  if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({ error: 'name already in phonebook' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: getRandom()
  }

  persons = persons.concat(person)
  res.json(person)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})