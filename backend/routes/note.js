const express = require('express');
const { body, validationResult } = require('express-validator');
const { Types } = require('mongoose');
const fetchUser = require('../middleware/fetchuser');
const router = express.Router();
const Note = require('../models/Note')



//ROUTE:1 ADD A NEW NOTE USING POST : /api/note/addnote  Login required
router.post('/addnote', fetchUser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),], async (req, res) => {
        try {
            const { title, description, tag } = req.body;

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const note = new Note({
                title, description, tag, user:'63ea7f5307cbf19e4106efa4'
            })
            const savedNote = await note.save()
            
            res.json(savedNote)
            req.user = savedNote.user.toString();

        } catch (error) {
            res.status(500).send("Internal Server Error");
        }
    })

    //ROUTE:2 FETCH USER SAVED USING GET: /api/note/fetchallnotes  Login required
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    const notes = await Note.find({user:req.id})
    res.json(notes);
}) 

//ROUTE:3 UPDATE NOTE USING PUT : /api/note/updatenote/:id   Login required
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;
    let newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

 // FIND NOTE TO UPDATE IT 
let note = await Note.findById(req.params.id)
if (!note) {return res.status(404).send("NOT FOUND")}; //IF NOTE NOT EXIST
// if (note.user.toString() != req.user.id) {return res.status(404).send("NOT ALLOWED")}; //IF ID OF USER AND NOTE NOT MATCHES
 
note = await Note.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true});
res.json(note);
  

})

//ROUTE:3 UPDATE NOTE USING DELETE : /api/note/deletenote/:id   Login required

router.delete('/deletenote/:id',fetchUser,async(req,res)=>{

    let note = await Note.findById(req.params.id)
    if (!note) {return res.status(404).send("NOT FOUND")}; //IF NOTE NOT EXIST

    // if (note.user.toString() != req.user.id) {return res.status(404).send("NOT ALLOWED")}; //IF ID OF USER AND NOTE NOT MATCHES

   note =  await Note.findByIdAndDelete(req.params.id);
    res.json({"SUCCESS": "FULLY DELETE NOTE",note: note})


})

module.exports = router;