const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const { ReplSet } = require('mongodb');
	
var db;
var s;

MongoClient.connect('mongodb://localhost:27017/Inventory',function(err, database) 
{
    if(err) return console.log(err)
	db = database.db('Inventory')
	app.listen(3030, function() {
		console.log('Listening at port number 3030')
	})
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

//Home Page when webpage opens
app.get('/', function(req,res) {
	db.collection('Mobiles').find().toArray(function(err,result) {
		if (err) return console.log(err)
		res.render('homepage.ejs',{data: result})
	})
})

//Add new product when clicked on it
app.get("/AddProduct", (req,res)=> {
	res.render('add.ejs')
})

//Update Stock when clicked on stock in update product
app.get("/updatestock",(req,res) => {
	res.render("updatestock.ejs")
})

//Update Price when clicked on price in update product
app.get("/updateprice",(req,res)=>{
	res.render("updateprice.ejs")
})

//Delete Product when clicked on delete
app.get("/deleteproduct",(req,res)=>{
	res.render("delete.ejs")
})

//table updation when new product is added
app.post('/AddData',(req,res)=>{
	db.collection("Mobiles").save(req.body,(err,result)=>{
		if(err) return console.log(err)
		console.log("New product added")
		res.redirect('/')
	})
})

//table updation when stock is changed
app.post("/UpdateStock",(req,res)=>{
	db.collection('Mobiles').find().toArray((err,result)=>{
		if(err) return console.log(err)
		for(var i=0;i<result.length;i++)
		{
			if(result[i].pid==req.body.id)
			{
				s = result[i].pstock
				break
			}
		}
		db.collection('Mobiles').findOneAndUpdate({pid: req.body.id}, {
			$set: {pstock: parseInt(s) + parseInt(req.body.stock)}},{sort: {_id: -1}},
	(err,result)=>{
		if(err) return res.send(err)
		console.log(req.body.id+' stock updated')
		res.redirect('/')
	})
	})
})

//table updation when price is updated
app.post("/UpdatePrice",(req,res)=>{
	db.collection('Mobiles').find().toArray((err,result)=>{
		if(err) return console.log(err)
		db.collection('Mobiles').findOneAndUpdate({pid: req.body.id}, {
			$set: {sp: req.body.price}},{sort: {_id: -1}},
	(err,result)=>{
		if(err) return res.send(err)
		console.log(req.body.id+' price updated')
		res.redirect('/')
	})
	})
})

//table updation after product is deleted
app.post("/delete",(req,res)=>{
	db.collection('Mobiles').find().toArray((err,result)=>{
		if(err) return console.log(err)
		db.collection('Mobiles').deleteOne({pid: req.body.id},(err,result)=>{
			if(err) return console.log(err)
			console.log(req.body.id+' deleted')
			res.redirect("/")
		})
	})
})
