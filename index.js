//todo PUSH TO HEROKU!


const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const Contact = require('./models/contact')

const requestLogger = (request, response, next) => {
	console.log('Method: ', request.method)
	console.log('Path: ', request.path)
	console.log('Body: ', request.body)
	console.log('---')
	next()
}

app.use(express.json())

app.use(requestLogger)

app.use(cors())

app.use(morgan('tiny'))

app.use(express.static('build'))

app.get('/info', (request, response) => {
	Contact.find({}).then(contacts => {
		response.setHeader('Content-Type', 'text/html')
		let contactsInfo = "<p>Phonebook has info for " + contacts.length + " people</p><br/>"
		let currentDate = new Date()
		let currentDateStr = "<p>" + currentDate + "</p>"
		//idk why it has the weird characters in the end...
		response.write(contactsInfo)
		response.write(currentDateStr)
		response.end()
	})

})

app.post('/api/persons', (request, response, next) => {
	//todo check error in posting somewhere here...part 3c
	const body = request.body
	if (!body.content === undefined) {
		return response.status(400).json({
			error: 'content missing'
		})
	}
	const person = new Contact({
		name: body.name,
		number: body.number,
	})
	person.save().then(savedPerson => {
		response.json(savedPerson)
	})
		.catch(error => next(error))

})

app.get('/api/persons', (request, response) => {
	Contact.find({}).then(contacts => {
		response.json(contacts)
	})
})


app.delete('/api/persons/:id', (request, response, next) => {
	Contact.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
	Contact.findById(request.params.id)
		.then(contact => {
			if (contact) {
				response.json(contact)
			}
			else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
	const { name, number } = request.body

	const contact = {
		name: body.name,
		number: body.number,
	}

	Contact.findByIdAndUpdate(request.params.id,
		{ name, number },
		{ new: true, runValidators: true, context: 'query' })
		.then(updatedContact => {
			console.log('updated contact????: ', updatedContact)
			console.log('how tf is the list looking?: ', Contact.find({}))
			response.json(updatedContact)
		})
		.catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}
	else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}
	next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)