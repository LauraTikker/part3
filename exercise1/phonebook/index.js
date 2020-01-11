const express = require('express')

const app = express()

let persons = [
     {
        name: "Arto Hellas", 
        number: "040-123456",
        id: 1
      },
      { 
        name: "Ada Lovelace", 
        number: "39-44-5323523",
        id: 2
      },
      { 
        name: "Dan Abramov", 
        number: "12-43-234345",
        id: 3
      },
      { 
        name: "Mary Poppendieck", 
        number: "39-23-6423122",
        id: 4
      }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })


app.get('/api/info', (request, response) => {
  const date = new Date()
  console.log(date.getDate())
  response.send(`Phonebook has info for ${persons.length} people \n
  ${Timestamp(date)}`)
})

const Timestamp = (date) => {

  const weekday = () => {
    switch(date.getDay()) {
      case 1: return "Mon";
      case 2: return "Tue";
      case 3: return "Wed";
      case 4: return "Thu";
      case 5: return "Fri";
      case 6: return "Sat";
      case 7: return "Sun";
    }}
  const month = () => {
    switch(date.getMonth()) {
      case 0: return "Jan"
      case 1: return "Feb"
      case 2: return "Mar"
      case 3: return "Apr"
      case 4: return "May"
      case 5: return "Jun"
      case 6: return "Jul"
      case 7: return "Aug"
      case 8: return "Sept"
      case 9: return "Oct"
      case 10: return ""
      case 11: return "September"
      case 12: return "September"

    }
  }  

  return (
    `
    ${weekday()} 
    ${date.getDate()}
    ${date.getMonth()}
    `

  )

}

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})