'use strict'

// This DEMO uses an in memory DB.

const PORT = process.env.PORT || 8080

const slug = require('slug')

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
var contactsDB = {
  'robert-jackiewicz': {
    name: 'Robert Jackiewicz',
    email: 'rob@thebrewbox.co',
    slug: 'robert-jackiewicz'
  }
}

// Start the Server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT} and ready to receive clients.`)
})

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
  res.redirect(`/contacts/${contact.slug}`)
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
  res.redirect(`/contacts/${contact.slug}`)
})

app.delete('/contacts/:id', (req, res) => {
  delete contactsDB[req.params.id]
  res.redirect('/')
})
