//use modules
const path = require('path');
const express = require('express');
const hbs = require("hbs");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();

//creating  mysql connection
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'lolgotcha',
    database: 'notetaking',
    multipleStatements: true
});

//connecting to database
conn.connect((err) =>{
    if(err) throw err;
    console.log('Connected to database');
});

//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine','hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
//set public folder as static folder for static files
app.use('/assets',express.static(__dirname+'/public'));

//route for homepage
app.get('/',(req,res) => {
    let sql = "SELECT * FROM articles;SELECT DISTINCT SubjectName FROM articles;";
    let query1 = conn.query(sql,[2,1], (err, results,fields) => {
        if(err)  throw err;
        res.render('Subjects',{
            results: results[0],
            SubjectName: results[1],
        });
    });
});
//route for dropdown menu
app.post('/sort',(req,res) => {
    let sql = "SELECT * FROM articles WHERE SubjectName = '"+req.body.filtering+"';SELECT DISTINCT SubjectName FROM articles";
    let query1 = conn.query(sql,[2,1], (err, results,fields) => {
        if(err)  throw err;
        res.render('Subjects',{
            results: results[0],
            SubjectName: results[1],
        });
    });
});
//route for new article
app.post('/save',(req, res) => {
    let date  = new Date();
    let data = {SubjectName: req.body.SubjectName, Topic: req.body.Topic, CreationDate: date, Description: req.body.Description};
    let sql = "INSERT INTO articles SET ?";
    let query = conn.query(sql, data, (err, results) => {
        if(err)  throw err;
    });
        res.redirect('/');
});
let cachedValue;

//route for delete article
app.post('/delete',(req, res) => {
    let sql = "DELETE FROM articles WHERE ID="+req.body.ID;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
        res.redirect('/');
    });
  });
//route  for update articles
app.post('/update',(req,res) => {
    let sql = "UPDATE articles SET Description = '"+req.body.desc+"' WHERE ID="+req.body.sid;
    let  query=conn.query(sql, (err, results) =>{
        if(err) throw err;
         res.redirect('/');
    });
});
//server listening
app.listen(8000, '0.0.0.0', () =>  {
    console.log('Server at port 8000');
});
