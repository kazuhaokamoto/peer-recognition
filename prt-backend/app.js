const express = require('express');
const config = require("./config");
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const MongoClient = require('mongodb').MongoClient;

const recogs = require('./mongoCalls/recognitions.js');
const recogPeople = require('./mongoCalls/recogPeople.js');
const user = require('./mongoCalls/user.js');
const Employee = require('./models/employee.model.js');

const app = express();
const { response } = require('express');
const databaseURI = config.DATABASE_URI;
const testFilesystemURI = config.TEST_FILESYSTEM_URI;
console.log(testFilesystemURI);
const sessionLength = config.SESSION_LENGTH;


app.use(session({ secret: 'compsci320', maxAge: sessionLength }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use("/profile-pics", express.static(testFilesystemURI));
app.options('*', cors());

mongoose.connect(databaseURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Calling passport.use tells Passport to run this code to match a username and
// password to a user.
// See http://www.passportjs.org/docs/configure/

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  verify
));

function verify(username, password, done) {
  Employee.findOne({ email: username }, (error, employee) => {
    return verifyHelper(error, employee, password, done);
  });
}

function verifyHelper(error, user, password, done) {
  if (error != null) {
    return done(error);
  }

  if (user == null) {
    return done(null, false, { message: "Employee not found." });
  }

  if (user.password != password) {
    return done(null, false, { message: "Incorrect password." });
  }

  return done(null, user);
}

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((ID, done) => {
  Employee.findById(ID, (error, user) => {
    done(error, user);
  });
});

// Handle POST request from login
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.send({ message: 'Logged in successfully', user: req.user });
});

// Endpoint to return all recognitions
app.get("/recogs", (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).send({ message: 'You are not logged in' });
  }
  else {
    recogs.getRecognitionsFromCompany(req, res);
  }
});

app.post("/lookupUser", (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).send({ message: 'You are not logged in' });
  }
  else {
    user.getUser(req, res);
  }
});

app.get("/getCurrentUser", (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).send({ message: 'You are not logged in' });
  }
  else {
    res.send(req.user);
  }
});

app.get("/getPeople", (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).send({ message: 'You are not logged in' });
  }
  else {
    recogPeople.peopleInCompany(req, res);
  }
});

app.options('*', cors())
app.post("/postRec", (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).send({ message: 'You are not logged in' });
  }
  else {
    recogs.postRecognition(req, res);
  }
});

app.use('/notifications', require('./routes/notifications'));
app.use('/core-values', require('./routes/core-values'));
app.use('/rockstars', require('./routes/rockstars.js'));
app.use('/values', require('./routes/coreValues'))

// The call to app.listen(PORT, ...) is in server.js
module.exports = app
