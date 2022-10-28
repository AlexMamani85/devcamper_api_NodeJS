const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
    // res.send('<h1>Hello from express</h1>');

    // res.send({ name: 'Brad' });
    // res.json({ name: 'Brad' });

    // res.sendStatus(400);
    // res.status(400).json({ success: false });
  res
    .status(200)
    .json({ success: true, msg: 'Show all bootcamps'});
});

router.get('/:id', (req,res)=>{
  res
    .status(200)
    .json({ success: true, msg: `Display Bootcamp with id: ${req.params.id}` });
});


router.post('/', (req,res)=>{
  res.status(200).json({ 
    success: true, 
    msg: 'Create new bootcamp'});
});

router.put('/:id', (req,res)=>{
  res
    .status(200)
    .json({ success: true, msg: `Update Bootcamp with id: ${req.params.id}`});
});

router.delete('/:id', (req,res)=>{
  res
    .status(200)
    .json({ success: true, msg: `Delete Bootcamp with id: ${req.params.id}`});
});

module.exports = router;