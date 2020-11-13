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
    database: 'notes'
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
    let sql = "SELECT * FROM contentlist";
    let query = conn.query(sql, (err, results) => {
        if(err)  throw err;
        res.render('Subjects',{
            results: results
        });
    });
});

//route for new subject
;
app.post('/save',(req, res) => {
    let date  = new Date();
    let Subject_name = req.body.SubjectName
    let data = {SubjectName: Subject_name, CreationDate: date};
    let sql = "INSERT INTO contentlist  SET ?";
    let query = conn.query(sql, data, (err, results) => {
        if(err)  throw err;
    });
    /*sql = "CREATE TABLE ? (ID INT NOT NULL AUTO_INCREMENT, ChapterName VARCHAR(20), Note TEXT, PRIMARY KEY (ID) );";
    query = conn.query(sql,Subject_name,(err,results) => {
        if(err) throw err;*/
    //});

        res.redirect('/');
});
//route for sub-table page
app.get('/',(req, res) => {
    let sql="SELECT * FROM articles WHERE Subject='"+req.body.SubjectName+"';";
    let query = conn.query(sql,(err,results)  => {
        if(err) throw err;
        res.render('Subject_sub',{
            results: results
        });
    });
});

//server listening
app.listen(8000, () =>  {
    console.log('Server at http://localhost:3000');
})
