
// import express

const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const Notes = require('../models/Note')
const { body, validationResult } = require('express-validator');

// router means path // router.get means get api to get data
//fetchallnotes api is used to fetch the all notes of logedIn user
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {

        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch(error){
        console.log(error.message)
        res.status(500).send("Some error occured")
      }
})

//addnote api is used to add note in backend
router.post('/addnote', fetchuser, [
    body('title', "Enter a valid title").isLength({ min: 3 }),
    body('description', "Enter a valid description").isLength({ min: 5 }),
], async (req, res) => {

    try {

        const { title, description, tag } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        //save query to save notes in backend
        const savenote = await note.save();
        res.json(savenote)
    } catch(error){
        console.log(error.message)
        res.status(500).send("Some error occured")
      }
})


// updataenote api is used to update the note of logedIn user
router.put('/updatenote/:id', fetchuser, async (req, res) => {

    const {title, description, tag} = req.body;
    //create a newNote object

    const newNote={}
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    let note = await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}

    if(note.user.toString()!==req.user.id)
    {
        return res.status(401).send("Not allowed")
    }
    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
    res.json({note});
})

// deletenote api is used to delete the note of logedIn user
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    const {title, description, tag} = req.body;
    

    let note = await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}

    if(note.user.toString()!==req.user.id)
    {
        return res.status(401).send("Not allowed")
    }
    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({"Success": "Note has been deleted"});
})

module.exports = router