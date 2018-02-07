// console.log('May the Node be with you');
const express = require('express');
const bodyParser= require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient

var db 

MongoClient.connect('mongodb://<user>:<password>@ds125618.mlab.com:25618/star-wars-quotes-servertest', (err, client) => {
	if (err) return console.log(err)
	db = client.db('star-wars-quotes-servertest')
	app.listen(3000, () => {
		console.log('listening on 3000')
	})
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

// app.listen(3000, function() {
// 	console.log('listening on 3000')
// })

// app.get('/', function(req, res) {
// 	res.send('Hello World')
// })
app.get('/', (req, res) => {
	// res.send('Hello World')
	// res.sendFile(__dirname + '/index.html')

	// var cursor = db.collection('quotes').find().toArray(function(err, results) {
	// 	console.log(results)
	// })
	db.collection('quotes').find().toArray((err, result) => {
		if (err) return console.log(err)
		res.render('index.ejs', {quotes: result})
	})
})

app.post('/quotes', (req, res) => {
	db.collection('quotes').save(req.body, (err, result) => {
		if (err) return console.log(err)

		console.log('saved to database')
		res.redirect('/')
	})
	// console.log(req.body)
})

// console.log(__dirname);

app.put('/quotes', (req, res) => {
	db.collection('quotes')
	.findOneAndUpdate({	name: 'Yoda' }, {
		$set: {
			name: req.body.name,
			quote: req.body.quote
		}
	}, {
		sort: {_id: -1}, 
		upsort: true
	}, (err, result) => {
		if (err) return res.send(err)
		res.send(result)
	})
})

app.delete('/quotes', (req, res) => {
	db.collection('quotes')
	.findOneAndDelete({ name: req.body.name}, 
		(err, result) => {
		if (err) return res.send(500, err)
		res.send({message: 'A Vader quote was deleted. Pray I don\'t alter it further.'})
	})
})