const express = require('express');
const dotenv = require('dotenv');

//Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

app.get('/api/v1/bootcamps', (req,res)=>{
    // res.send('<h1>Hello from express</h1>');

    // res.send({ name: 'Brad' });
    // res.json({ name: 'Brad' });

    // res.sendStatus(400);
    // res.status(400).json({ success: false });
  res
    .status(200)
    .json({ success: true, msg: 'Show all bootcamps'});
});

app.get('/api/v1/bootcamps/:id', (req,res)=>{
  res
    .status(200)
    .json({ success: true, msg: `Display Bootcamp with id: ${req.params.id}` });
});


app.post('/api/v1/bootcamps', (req,res)=>{
  res.status(200).json({ 
    success: true, 
    msg: 'Create new bootcamp'});
});

app.put('/api/v1/bootcamps/:id', (req,res)=>{
  res
    .status(200)
    .json({ success: true, msg: `Update Bootcamp with id: ${req.params.id}`});
});

app.delete('/api/v1/bootcamps/:id', (req,res)=>{
  res
    .status(200)
    .json({ success: true, msg: `Delete Bootcamp with id: ${req.params.id}`});
});

const PORT = process.env.PORT || 5001;

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on PORT: ${PORT}`)
);

