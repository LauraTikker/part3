/* eslint-disable linebreak-style */
require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser') 
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person.js')

// eslint-disable-next-line no-unused-vars
const body = morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(bodyParser.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  }).catch(error => next(error))
})

app.get('/api/info', (request, response, next) => {
  const date = new Date()
  Person.find({}).then(persons => {
    response.send(`Phonebook has info for ${persons.length} people <br /> <br />  ${date.toString()}`)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person) {
      response.json(person.toJSON())
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(person => {
    if (person) {
      response.status(204).json(person.toJSON())
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const personToBeAdded = request.body

  const newPerson = new Person({
    name: personToBeAdded.name,
    number: personToBeAdded.number
  })

  newPerson.save().then(savedPerson => {
    if (savedPerson) {
      response.status(201).json(savedPerson.toJSON())
    } else {
      response.status(404).end()
    }

  }).catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {

  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
      if (updatedPerson)  {
        response.status(200).json(updatedPerson.toJSON())
      } else {
        response.status(404).end()
      }

    }).catch(error => next(error))

})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId')  {
    return response.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
