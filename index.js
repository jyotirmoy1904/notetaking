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
    let sql = "SELECT * FROM articles;SELECT DISTINCT SubjectName FROM articles";
    let query1 = conn.query(sql,[2,1], (err, results,fields) => {
        if(err)  throw err;
        res.render('Subjects',{
            results: results[0],
            dropdown: results[1]
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
            dropdown: results[1]
        });
    });
});
//route for new article
app.post('/save',(req, res) => {
    let date  = new Date();
    let data = {SubjectName: req.body.SubjectName, Topic: req.body.Topic, CreationDate: date};
    let sql = "INSERT INTO articles SET ?";
    let query = conn.query(sql, data, (err, results) => {
        if(err)  throw err;
    });
        res.redirect('/');
});
/*
//route for update article
app.post('/article/update',(req,res) => {
    //let  data={Body=body.product.Body};
    let sql="UPDATE articles SET Body = '"+req.body.Description+"' WHERE Topic = '"+req.body.Topic;
    let query  = conn.query(sql,(err,results) => {
        if(err)  throw err;
        res.redirect('/article');
    });
});*/
//route for delete article
app.post('/delete',(req, res) => {
    let sql = "DELETE FROM articles WHERE ID="+req.body.ID;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
        res.redirect('/');
    });
  });

//server listening
app.listen(8000, () =>  {
    console.log('Server at http://localhost:3000');
})