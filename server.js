var express = require('express');
var app = express();
const user = require("./user.json");
const path = require("path");
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(express.static(path.join(__dirname + "/public")));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.get('/chat-bot', function (req, res) {
    res.send('welcome to the chat_bot');
});

// user signup

app.post('/signup', function (req, res) {
    try {
        let signupData = {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password
        }; 
        if (user.findIndex(data => data.email == signupData.email) != -1) {
            res.send('user already exist');
        } 
        else {  
            user.push(signupData);
            fs.writeFile('user.json', JSON.stringify(user), err => {
                if (err) {
                    throw err;
                }
            })
            res.redirect('/');
            res.status(200).send('saved');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send('something went wrong');
    }
});

// user login 

app.post('/login', function (req, res) {
    try {
        let email = req.body.email;
        let password = req.body.password;
            if (user.some(element => (element.email == email && element.password == password) )) {
                return res.sendFile(path.join(__dirname + '/public/main.html'));
            //    return res.status(200).send('successfully LoggedIn!!!');
            }else{
                res.status(400).send('Invalid Login');
            } 
    } catch (err) {
        console.log(err);
        res.status(500).send('something went wrong');
    }
})

//App setup

const PORT = 2800;
const server = app.listen(PORT, function () {
    console.log(`Server Is Listening in Port,${PORT}`);
});

// Socket setup

const io = require("socket.io")(server);

io.on("connection", function (socket) {
    socket.on('chat', function (message) {
        io.emit('chat', message)
    })
})
