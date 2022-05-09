//todo PUSH TO HEROKU!

require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Contact = require('./models/contact')



app.use(express.json())

app.use(morgan('tiny'))

app.use(cors())

app.use(express.static('build'))


app.get('/info', (request, response) => {

	response.setHeader('Content-Type', 'text/html')
	let contactsInfo = "<p>Phonebook has info for " + contacts.length + " people</p><br/>"
	let currentDate = new Date()
	let currentDateStr = "<p>" + currentDate + "</p>"
	//idk why it has the weird characters in the end...
	response.write(contactsInfo)
	response.write(currentDateStr)
	response.end()

})

app.get('/api/persons/:id', (request, response) => {
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

// const id = Number(request.params.id)
// console.log('Id received: ', id)
// const person = contacts.find(p => p.id === id)

// if (person) {
// 	response.json(person)
// }
// else {
// 	response.status(404).end()
// }

app.delete('/api/persons/:id', (request, response) => {
	Contact.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))

})

const generateId = () => {
	const maxId = contacts.length > 0
		? Math.max(...contacts.map(n => n.id))
		: 0
	return maxId + 1
}

app.post('/api/persons', (request, response) => {
	//todo check error in posting somewhere here...part 3c
	const body = request.body
	if (!body.content === undefined) {
		return response.status(400).json({
			error: 'content missing'
		})
	}
	const person = new Contact({
		name: body.name || 'No name in post request gj',
		number: body.number || 'No number in post request gj',
	})
	Contact.find({}).then(contacts => {
		if (contacts.some(p => p.name === person.name)) {
			return response.status(400).json({
				error: 'contact already exists!'
			})
		}
		else {
			person.save().then(savedPerson => {
				console.log(savedPerson)
				response.json(savedPerson)
			})
		}
	})

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

	next(error)
}

app.use(errorHandler)

app.get('/api/persons', (request, response) => {
	Contact.find({}).then(contacts => {
		response.json(contacts)
	})
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)