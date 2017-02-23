# Intro to DB and MongoDB

## Running the app

For each demo app (since there are three) navigate to the appropriate
one you want to run and...

``` shell
cd mongo_db
npm install
node server.js
```

## Lecture Notes
### What are the different ways we can store data?

- In memory
- In a file
- In a DBMS: Database Management System. a.k.a "database" or "DB"

### Code demo: In-memory storage

### Code demo: In-file storage

### What is a database?

- A database is a computer program
- Stores data in files
- Has a query language (a programming language designed to work with data)

### Why do we need Databases? Why not store data in files?

## Mongo DB

### Structure of a Mongo DB database

- documents: store a single object (ex: a task. {description: 'Get milk', done: false})
- collections: A collection groups together objects of the same type. (ex: We can say that a tasks collection contains many task documents.)
- databases: A database contains many collections. Usually each application you write will use its own separate database.

### Useful Query Commands

MongoDB comes with many different query commands.

#### `find`

Retrieve all documents matching a certain condition. If no conditions are passed in, return all documents in the collection.

Example: Retrieve all tasks that have the property 'done' set to true

```
db.tasks.find({done: true})
```

https://docs.mongodb.com/manual/reference/method/db.collection.find/

#### `insert`

Insert a new document in a collection.

https://docs.mongodb.com/manual/reference/method/db.collection.insert/

#### `remove`

https://docs.mongodb.com/manual/reference/method/db.collection.remove/

#### `update`

https://docs.mongodb.com/manual/reference/method/db.collection.update/
