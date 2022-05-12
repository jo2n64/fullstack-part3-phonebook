const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('Connecting to ', url)

mongoose.connect(url)
	.then(() => {
		console.log('connected to MongoDB')
	})
	.catch(error => {
		console.log('error connecting to MongoDB: ', error)
	})


const contactSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true
	},
	number: {
		//might complain for typeerror
		type: String,
		match: /\d{2,3}-\d{5,}/,
		// minLength: 8,
		// validate: {
		// 	validator: function (v) {
		// 		const regex = /\d({2}|{3})-[0-9]/
		// 		return regex.test(v)
		// 	},
		// 	message: props => `${props.value} is not a valid phone number!`
		// },
		required: true
	},
})

contactSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Contact', contactSchema)