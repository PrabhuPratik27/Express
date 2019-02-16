const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const expressval = require('express-validator');
const mongojs = require('mongojs');
const db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectID;

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

//Body parser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: false
}));

//Setting up a static path
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.locals.errors = null;
    next();
})

//Express validtor middleware
app.use(expressval({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.get('/', (req, res) => {
    db.users.find(function (err, docs) {
        res.render('index', {
            users: docs
        });
    });

});

app.post('/users/add', (req, res) => {

    req.checkBody('firstname', 'FirstName is required').notEmpty();

    req.checkBody('lastname', 'LastName is required').notEmpty();

    req.checkBody('email', 'Email is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        db.users.find(function (err, docs) {
            res.render('index', {
                users: docs,
                errors: errors
            });
        });

    } else {
        let newUser = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            age: req.body.age
        }

        db.users.insert(newUser,function(err,result){
            if(err){
                console.log(err);
                
            }
            else{
                 res.redirect('/');
            }
        })

        console.log("Success");

    }

});

app.delete('/users/delete/:id', (req, res) => {
    db.users.remove({_id : ObjectId(req.params.id)},function(err,response){
        if(err){
            console.    log(err);
        } else {
             res.redirect('/');
        }
    })
});

app.listen(4000, () => {
    console.log(`Server started on port 4000`);
});