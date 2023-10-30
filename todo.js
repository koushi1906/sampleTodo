const express = require('express');
const cors = require('cors');
const app = express();

const port = 3000;

var dataArray = [];

app.use(express.json());
app.use(cors());

// get request
app.get('/users', (req, res) => {
  res.json(dataArray);
});

// post request
app.post('/users', (req, res) => {
  const {firstName, lastName } = req.body;
  if(!firstName || !lastName){
   return req.status(400).json({message: 'please provide firstname and lastname'});
  }
  const newEntry = {
    id: Date.now(),
    firstName,
    lastName
  };
  dataArray.push(newEntry);
  res.json({message: "user is added successfully", data:newEntry})
});

// put request
app.put('/users/:id', (req, res) => {
  const {id} = req.params;
  const {firstName, lastName} = req.body;
  const user = dataArray.find(user => user.id.toString() === id);
  if (!user){
    return res.status(404).json({message: 'user not found'});
  }
  user.firstName = firstName;
  user.lastName = lastName;

  res.json({message: 'user updated successfully', data: user});
});

// delete request
app.delete('/users/:id', (req, res) => {
  const {id} = req.params;
  const user = dataArray.find(user => user.id.toString() === id);
  if(!user){
    return res.status(404).json({message: 'user not found'});
  } else{
    dataArray = dataArray.filter(user => user.id.toString() !== id);
    res.json({message: 'Uer deleted successfully', data: dataArray});
  }
  
});

// listen request
app.listen(port, ()=>{
  console.log(`Server is running on port ${port}`);
});