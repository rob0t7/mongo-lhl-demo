'use strict'

// This DEMO uses an in memory DB.

const PORT = process.env.PORT || 8080

const slug = require('slug')

// Imports for File Storage
const fs = require('fs')
const csv = require('csv')

// Express App server Dependencies
const express        = require("express")
const bodyParser     = require("body-parser")
const morgan         = require('morgan')
const methodOverride = require('method-override')
const pug            = require('pug')
const app            = express()

// Setup ExpressJS
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(methodOverride((req, res) => {
  if(req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}))
app.use(express.static('public'))
app.set('view engine', 'pug')

// Our Database (in memory from a file)
var contactsDB = {}

// Parse the CSV File
csv.parse(fs.readFileSync('contacts.csv'), {columns: true, autoparse: true}, (err, output) => {
  output.forEach( x => {
    contactsDB[x.slug] = x
  })

  // Start the Server
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT} and ready to receive clients.`)
  })
})

function writeMemoryToFile(cb) {
  var fileOutput = []
  for(let contactKey in contactsDB) {
    fileOutput.push(contactsDB[contactKey])
  }

  csv.stringify(fileOutput, (err, output) => {
    output = `name,email,slug\n${output}`
    fs.writeFile('addresses-new.csv', output, (err) => {
      cb()
    })
  })
}

app.get('/', (req, res) => {
  res.render('index', {contactsDB})
})

app.get('/contacts', (req, res) => {
  res.render('index', {contactsDB})
})

app.get('/contacts/new', (req, res) => {
  res.render('new')
})

app.post('/contacts', (req, res) => {
  var contact = req.body
  contact.slug = slug(contact.name.toLowerCase())

  contactsDB[contact.slug] = contact

  // write to CSV file
  writeMemoryToFile( () => {
    res.redirect(`/contacts/${contact.slug}`)
  })
})

app.get('/contacts/:id', (req, res) => {
  var contact = contactsDB[req.params.id]
  res.render('show', {contact})
})

app.get('/contacts/:id/edit', (req, res) => {
  var contact = contactsDB[req.params.id]
  res.render('edit', {contact})
})

app.put('/contacts/:id', (req, res) => {
  var contact = contactsDB[req.params.id]
  contactsDB[contact.slug] = Object.assign({}, contact, req.body)

  writeMemoryToFile( () => {
    res.redirect(`/contacts/${contact.slug}`)
  })
})

app.delete('/contacts/:id', (req, res) => {
  delete contactsDB[req.params.id]

  writeMemoryToFile( () => {
    res.redirect('/')
  })
})
