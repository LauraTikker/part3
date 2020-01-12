const express = require('express')
const app = express()
const bodyParser = require('body-parser') 
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const url = `mongodb+srv://fullstack:AlwaysWrite12@cluster0-2zo3s.mongodb.net/persons-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const body = morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(bodyParser.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

app.get('/api/persons', (request, response) => {
    response.json(persons)
})


app.get('/api/info', (request, response) => {
  const date = new Date()
  response.send(`Phonebook has info for ${persons.length} people <br /> <br />  ${date.toString()}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
  
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()

})

app.post('/api/persons', (request, response) => {

  const personToBeAdded = request.body

  if (personToBeAdded.name && personToBeAdded.number)  {

    const personNameCheck = persons.find(person => person.name === personToBeAdded.name)

    if (!personNameCheck)  {
      const id = Math.random()*1000000

      personToBeAdded.id = id.toFixed(0)
      persons.concat(personToBeAdded)

      response.status(201).json(personToBeAdded)
    } else {
      response.status(201).json({ error: 'name must be unique' })
    }
    
  } else {
    response.status(406).json({ error: 'name or number missing' })
  }
  
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})