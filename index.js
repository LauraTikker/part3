require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser') 
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person.js')

const body = morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(bodyParser.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons.map(person => person.toJSON()))
    })
})

app.get('/api/info', (request, response) => {
  const date = new Date()
  Person.find({}).then(persons => {
    response.send(`Phonebook has info for ${persons.length} people <br /> <br />  ${date.toString()}`)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person) {
      response.json(person.toJSON())
    } else {
      response.status(404).end()
    }
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(person => {
    if (person) {
      response.json(person.toJSON())
    } else {
      response.status(404).end()
    }
  })
})

app.post('/api/persons', (request, response) => {
  const personToBeAdded = request.body
  if (personToBeAdded.name && personToBeAdded.number)  {

     const newPerson = new Person({
        name: personToBeAdded.name,
        number: personToBeAdded.number
      })

      newPerson.save().then(savedPerson => {
        response.status(201).json(savedPerson.toJSON())
      })
        
  } else {
    response.status(406).json({ error: 'name or number missing' })
  }
  
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
