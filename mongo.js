const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
    console.log('give password as argument')
    process.exit(1)
}

    const password = process.argv[2]

  const url = `mongodb+srv://fullstack:${password}@cluster0-2zo3s.mongodb.net/persons-app?retryWrites=true&w=majority`

  mongoose.connect(url, { useNewUrlParser: true })

  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

  const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5)  {

const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(response =>    {
      console.log(`added ${process.argv[3]} ${process.argv[4]} to the phonebook`)
      mongoose.connection.close()
  })
}
if (process.argv.length === 3)      {

    Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
            '</br>'
            console.log(`${person.name} ${person.number}`)
        });
        mongoose.connection.close()
    })
    
} else {
    mongoose.connection.close()
}
