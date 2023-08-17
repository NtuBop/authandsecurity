require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');


const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});



userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

////////Home Route///////
app.route('/')
.get((req, res) => {
    res.render("home");
})

////////Login Route///////
app.route('/login')
.get((req, res) => {
    res.render("login");
})
.post( async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const foundUser = await User.findOne({email: username}).exec();
        if (foundUser) {
            
            if (foundUser.password == password) {
                res.render('secrets');
            } else {
                res.send('User Not Found')
            }
        } else {
            res.send('User Not Found')
        }
    } catch (e) {
        console.log(e);
    }
})

////////Register Route///////
app.route('/register')
.get((req, res) => {
    res.render("register");
})
.post((req, res) => {
    const newUser = new User ({
        email: req.body.username,
        password: req.body.password
    });
    try {
        newUser.save()
        res.render('secrets');
    } catch (e) {
        console.log(e);g
    }
    
})

////////Submit Route///////








app.listen(3000, () => {
    console.log("Server running on 3000");
});