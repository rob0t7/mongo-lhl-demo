'use strict'

module.exports = (db) => {
  return {
    getAllContacts: (callback) => {
      db.collection('contacts').find({}).toArray( (err, output) => {
        err ? callback(err) : callback(null, output)
      })
    },
    insertContact: (record, callback) => {
      db.collection('contacts').insertOne(record, (err, r) => {
        err ? callback(err) : callback(null, r)
      })
    },
    fetchContact: (uuid, callback) => {
      db.collection('contacts').findOne({uuid: uuid}, (err, contact) => {
        err ? callback(err) : callback(null, contact)
      })
    },
    updateContact: (uuid, record, callback) => {
      db.collection('contacts').updateOne({uuid: uuid}, {$set: record}, (err, output) => {
        err ? callback(err) : callback(null, output)
      })
    },
    removeContact: (uuid, callback) => {
      db.collection('contacts').removeOne({uuid: uuid}, (err, output) => {
        err ? callback(err) : callback(null, output)
      })
    }
  }
}
