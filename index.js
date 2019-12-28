//Express is a package helps in using the nodejs framework easier

const express_var = require("express");

//Mongoose is a package used to connect nodejs application with mongodb and manipulate mongodb from nodejs application

const mongoose_package_var = require("mongoose");

//bcrypt is a package used to encrypt/hash the password given by the user

const bcrypt_var = require("bcrypt");

//here we are initializing the app variable with express function

const app = express_var();

//in the below line "User_variable" is a model variable which is exported from a user schema file which is written in /database/users

const { User_variable } = require("./database/users");

//connection to mongodb here mongoose_package_var is a variable holding all the properties of mongoose package

mongoose_package_var
    .connect("mongodb://localhost/xlenzNode", { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.error("Could not connect to MongoDB..."));

//in below line we are initializing the usage of functionality of express package i.e using json object for request and response purpose

app.use(express_var.json());

//writing a get request for home route i.e '/'
app.get('/', (req, res) => {
    //once the home route is called this block of code will be executed
    res.send({ message: "Welcome to NodeJS and MongoDB" })
})

//writing a post request to register a user
app.post('/register', async (req, res) => {
    //once the /register route is called this block of code will be executed
    //finding an existing user
    let userObj = await User_variable.findOne({ email: req.body.email });
    if (userObj) return res.status(400).send({
        //if user is found
        message: "User already registered."
    });
    //else create a new user object and assigning it to userObj variable
    userObj = new User_variable({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    });
    //hash the password requested from the user(i.e entered by the user) and update it in the same object (i.e userObj.password)
    userObj.password = await bcrypt_var.hash(userObj.password, 10);
    //once you hash and update the object with hashed password save the object using the save() which is a mongoose method
    await userObj.save()
        .then(() => res.status(200).send({
            message: "Success"
        }))
        .catch(err => res.status(400).send({
            message: "registration failed"
        }))
})

//Writing a post request to login a user (i.e to verify a user and return the user object if he is existing in the database)
app.post("/login", async (req, res) => {
    //check for the user in the database using a findOne mongoose method if the user is found store the user object in userObj variable
    let userObj = await User_variable.findOne({ email: req.body.email });
    //check whether userObj variable is containing object or it is null && compare the password given by the user(req.body.password) and the password found from the database (user.password) here 'user' is the above variable which is used to stored the user data
    if (userObj && bcrypt_var.compareSync(req.body.password, userObj.password)) {
        //here we use status() express method to return status to user and use send() express method to send the response data to user 
        res.status(200).send({
            message: "Success",
            _id: userObj._id,
            name: userObj.name,
            email: userObj.email
        });
    }
    //if user is not found we go to else case
    else {
        res.status(401).send({
            message: "incorrect email or password"
        })
    }
});


//writing a put request to update the user information
app.put('/userdetailsupdate',async(req,res)=>{
    //updated password given by the user is been hashed and stored in password variable 
    const password = await bcrypt_var.hash(req.body.password, 10)
    //here we are finding a user with the help of email parameter (as email is a unique parameter) and update it with below information
    User_variable.findOneAndUpdate({email:req.body.email},{
        //here we only update name and password but not email (because it is a unique one)
        name:req.body.name,
        password:password
    })
    .then(()=>{
        res.status(200).send({
            message:"successfully updated"
        })
    })
    .catch(()=>{
        res.status(400).send({
            message:"Failed to update user"
        })
    })
})


//writing a delete request to delete the user
//here user id is passed as a header parameter from the user end
app.delete('/deleteuser/:id',(req,res)=>{
    //we use user id header parameter (i.e id) to find the user in database and delete the record from database 
    User_variable.findByIdAndDelete(req.params.id)
    .then(()=>{
        res.status(200).send({
            message:"User is deleted successfully"
        })
    })
    .catch(()=>{
        res.status(400).send({
            message:"Failed to delete user"
        })
    })
})
//declaring port variable and equating it with port number (i.e 3000) 
const port = 3000;

//below line is used to start application on a particular port
app.listen(port, () => console.log(`Listening on port ${port}...`));
