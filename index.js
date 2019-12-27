//Express is a package helps in using the nodejs framework easier

const express = require("express");

//Mongoose is a package used to connect nodejs application with mongodb and manipulate mongodb from nodejs application

const mongoose = require("mongoose");

//bcrypt is a package used to encrypt/hash the password given by the user

const bcrypt = require("bcrypt");

//here we are initializing the app variable with express function

const app = express();

//in the below line "User" is a model variable which is exported from a user schema file which is written in /database/users

const { User } = require("./database/users");

//connection to mongodb

mongoose
    .connect("mongodb://localhost/xlenzNode", { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.error("Could not connect to MongoDB..."));

//in below line we are using the functionality of express package i.e using json object for request and response purpose

app.use(express.json());

//writing a get request for home route i.e '/'
app.get('/', (req, res) => {
    //once the home route is called this block of code will be executed
    res.send({ message: "Welcome to NodeJS and MongoDB" })
})

//writing a post request to register a user
app.post('/register', async (req, res) => {
    //once the /register route is called this block of code will be executed
    //finding an existing user
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send({
        //if user is found
        message: "User already registered."
    });
    //else create a new user object
    user = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    });
    //hash the password requested from the user(i.e entered by the user) and update it in the same object (i.e user.password)
    user.password = await bcrypt.hash(user.password, 10);
    //once you hash and update the object with hashed password save the object using the save() which is a mongoose method
    await user.save()
        .then(() => res.status(200).send({
            message: "Success"
        }))
        .catch(err => console.error("Registration Failed"));
})

//Writing a post request to login in a user (i.e to verify a user and return the user object if he is existing in the database)
app.post("/login", async (req, res) => {
    //check for the user in the database using a findOne mongoose method if the user is found store the user object in user variable
    let user = await User.findOne({ email: req.body.email });
    //check whether user variable is containing object or it is null && compare the password given by the user(req.body.password) and the password found from the database (user.password) here 'user' is the above variable which is used to stored the user data
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        //here we use status() express method to return status to user and use send() express method to send the response data to user 
        res.status(200).send({
            message: "Success",
            _id: user._id,
            name: user.name,
            email: user.email
        });
    }
    //if user is not found we go to else case
    else {
        res.status(401).send({
            message: "incorrect email or password"
        })
    }
});
//declaring port variable and equating it with port number (i.e 3000) 
const port = 3000;

//below line is used to start application on a particular port
app.listen(port, () => console.log(`Listening on port ${port}...`));
