const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

let contacts = [
	{
		"id": 1,
		"name": "Arto Hellas",
		"number": "040-123456"
	},
	{
		"id": 2,
		"name": "Ada Lovelace",
		"number": "39-44-5323523"
	},
	{
		"id": 3,
		"name": "Dan Abramov",
		"number": "12-43-234345"
	},
	{
		"id": 4,
		"name": "Mary Poppendieck",
		"number": "39-23-6423122"
	}
]

app.use(express.json())

app.use(morgan('tiny'))

app.use(cors())

app.get('/api/persons', (request, response) => {
	response.json(contacts)
})

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
	const id = Number(request.params.id)
	console.log('Id received: ', id)
	const person = contacts.find(p => p.id === id)

	if (person) {
		response.json(person)
	}
	else {
		response.status(404).end()
	}
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	if (id <= contacts.length) {
		contacts = contacts.filter(person => person.id != id)
		response.status(204).end()
	}
	else {
		response.status(404).end()
	}

})

const generateId = () => {
	const maxId = contacts.length > 0
		? Math.max(...contacts.map(n => n.id))
		: 0
	return maxId + 1
}

app.post('/api/persons', (request, response) => {
	const body = request.body
	if (!body.name || !body.number) {
		return response.status(400).json({
			error: 'content missing'
		})
	}
	const person = {
		id: generateId(),
		name: body.name || 'No name in post request gj',
		number: body.number || 'No number in post request gj',
	}
	if (contacts.some(p => p.name === person.name)) {
		return response.status(400).json({
			error: 'contact already exists!'
		})
	}
	else {
		contacts = contacts.concat(person)
		console.log(person)
		response.json(person)
	}
})


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)