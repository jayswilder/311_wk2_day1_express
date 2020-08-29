
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 4000

const { users } = require('./state')
let counter = users.length

/* BEGIN - create routes here */

app.use(express.json())

// Gets all users and returns a JSON
app.get('/users', (req, res) => res.json(users));

// Get specific user by id and return error message if user id does not exist as a 400 status code
app.get('/users/:userId', (req, res) => {
  const userFound = users.some(user => user._id === parseInt(req.params.userId));

  if (userFound) {
    res.json(users.filter(user => user._id === parseInt(req.params.userId)));
  } else {
    res.status(400).json({ Error: `No user with the ID of ${req.params.userId}` });
  }
});

// Create a new user
app.post('/users', (req, res) => {
  // increase counter by 1 before creating and pushing a new user to the users array.
  counter++

  const newUser = {
    _id: counter,
    name: req.body.name,
    occupation: req.body.occupation,
    avatar: req.body.avatar,
  }

  if (!newUser.name || !newUser.occupation || !newUser.avatar) {
    return res.status(400).json(
      {
        Error: "Please include, name, occupation, avatar picture URL, using the format below:'",
        "---": "--------------- Format Below ---------------",
        "name": "First-Name Last-Name",
        "occupation": "User's job title or 'Student' if user is currently attending school",
        "avatar": "Link to user's chosen profile picture.",
        "--": "---------------- See Note Below for Reference ----------------",
        Note: `keywords: name, occupation, & avatar need to be in quotations, as well as their provided values. example:  "name": "Jason Bourne"`
      });
  }
  users.push(newUser);
  res.json(users);
})

// Update a user's information
app.put('/users/:userId', (req, res) => {
  const userFound = users.some(user => user._id === parseInt(req.params.userId));

  if (userFound) {
    const updateUser = req.body;
    users.forEach(user => {
      if (user._id === parseInt(req.params.userId)) {
        user.name = updateUser.name ? updateUser.name : user.name;
        user.occupation = updateUser.occupation ? updateUser.occupation : user.occupation;
        user.avatar = updateUser.avatar ? updateUser.avatar : user.avatar;

        // return the updated users information
        res.json({ message: 'User updated', user })
      }
    })
  } else {
    res.status(400).json({ Error: `No user with the ID of ${req.params.userId}` });
  }
});


// Delete a user
app.delete('/users/:userId', (req, res) => {
  const userFound = users.some(user => user._id === parseInt(req.params.userId));

  if (userFound) {
    users.forEach(user => {
      if (user._id === parseInt(req.params.userId)) {
        user.isActive = false;
      }
    })
    res.send({
      message: 'User has been removed',
      users: users.filter(user => user._id === parseInt(req.params.userId))
    });
  } else {
    res.status(400).json({ Error: `No user with the ID of ${req.params.userId}` });
  }
});


/* END - create routes here */

app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`))