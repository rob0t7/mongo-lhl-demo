'use strict'

const express = require('express')
const uuid    = require('uuid')
const Router  = express.Router

module.exports = (dataHelpers) => {
  var router = Router()

  router.get('/', (req, res) => {
    dataHelpers.getAllContacts( (err, contactsDB) => {
      res.render('index', {contactsDB})
    })
  })

  router.get('/new', (req, res) => {
    res.render('new')
  })

  router.post('/', (req, res) => {
    let contact = {
      name: req.body.name,
      email: req.body.email,
      uuid:  uuid()
    }
    dataHelpers.insertContact(contact, (err) => {
      res.redirect('/')
    })
  })

  router.get('/:id', (req, res) => {
    dataHelpers.fetchContact(req.params.id, (err, record) => {
      res.render('show', {contact: record})
    })
  })

  router.get("/:id/edit", (req, res) => {
    dataHelpers.fetchContact(req.params.id, (err, record) => {
      res.render('edit', {contact: record})
    })
  })

  router.put('/:id', (req, res) => {
    dataHelpers.updateContact(req.params.id, {name: req.body.name, email: req.body.email}, (err, contact) => {
      res.redirect(`${req.params.id}`)
    })
  })

  router.delete('/:id', (req, res) => {
    dataHelpers.removeContact(req.params.id, (err) => {
      res.redirect('/')
    })
  })
  return router
}
