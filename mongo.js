const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('Please provide the password as an argument: node mongo.js <password>')
	process.exit(1)
}

const password = process.argv[2]
const contactName = process.argv[3]
const contactNumber = process.argv[4]

const url =
	`mongodb+srv://fizzypickles:${password}@cluster0.t7eq7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
	name: String,
	number: Number,
})

const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
	name: contactName,
	number: contactNumber,
})

if (contactName != null && contactNumber != null) {
	contact.save().then(result => {
		console.log(`added ${contactName} number ${contactNumber} to phonebook`)
		mongoose.connection.close()
	})
}

else {
	Contact.find({}).then(result => {
		result.forEach(contact => {
			console.log(contact)
		})
		mongoose.connection.close()
	})
}