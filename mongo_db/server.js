'use strict'

// This DEMO uses an in memory DB.

const PORT = process.env.PORT || 8080

const slug = require('slug')

// Imports for mongo
const MongoClient = require('mongodb').MongoClient
const mongoURL = 'mongodb://localhost/contacts'

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

// We will use the closure object later
var db;

MongoClient.connect(mongoURL, (err, dbConnection) => {
  if(err) {
    console.error("Could not connect to mongo")
    return;
  }
  db = dbConnection
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT} and ready to receive clients.`)
  })
})

app.get('/', (req, res) => {
  db.collection('contacts').find({}).toArray( (err, contactsDB) => {
    res.render('index', {contactsDB})
  })
})

app.get('/contacts', (req, res) => {
  db.collection('contacts').find({}).toArray( (err, contactsDB) => {
    res.render('index', {contactsDB})
  })
})

app.get('/contacts/new', (req, res) => {
  res.render('new')
})

app.post('/contacts', (req, res) => {
  var contact = req.body
  contact.slug = slug(contact.name.toLowerCase())
  db.collection('contacts').insert(contact, (err, output) => {
    res.redirect(`/contacts/${contact.slug}`)
  })
})

app.get('/contacts/:id', (req, res) => {
  db.collection('contacts').findOne({slug: req.params.id}, (err, contact) => {
    res.render('show', {contact})
  })
})

app.get('/contacts/:id/edit', (req, res) => {
  db.collection('contacts').findOne({slug: req.params.id}, (err, contact) => {
    res.render('edit', {contact})
  })
})

app.put('/contacts/:id', (req, res) => {
  db.collection('contacts').updateOne({slug: req.params.id}, { $set: req.body}, (err, output) => {
    res.redirect(`/contacts/${req.params.id}`)
  })
})

app.delete('/contacts/:id', (req, res) => {
  db.collection('contacts').deleteOne({slug: req.params.id}, (err, output) => {
    res.redirect('/')
  })
})
