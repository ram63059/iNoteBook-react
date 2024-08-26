const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//Route 1
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });

    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error has occured");
  }
});


//Route 

router.post("/addnote", fetchuser,
  [
    body("title", "title must be 3 characters").isLength({ min: 3 }),
    body("description", "description must be aleast five char").isLength({min: 5,}),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.send({ errors: errors.array() });
      }

      const { title, description, tag } = req.body;

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error has occured");
    }
  }
);

//Route 3 update an existing note

router.put("/updatenote/:id", fetchuser, async (req, res) => {
   
        
    const {title,description,tag}=req.body;
    try {
        
   
    const newNote={};

    if(title){newNote.title=title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag};

    let note= await Notes.findById(req.params.id);

    if(!note){return res.status(401).send('Not found');}

    if(note.user.toString()!==req.user.id){
        return res.status(401).send('not allowed');} 
       
    note = await Notes.findByIdAndUpdate(req.params.id, {$set:newNote},{new:true})
    
        res.json({note});
    } catch (error) {
        console.error(error.message);
      res.status(500).send("some error has occured");
    }
      })

//Route 4 deleting an existing note

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
   
        
try {
    

    let note= await Notes.findById(req.params.id);

    if(!note){return res.status(401).send('Not found');}

    if(note.user.toString()!==req.user.id){
        return res.status(401).send('not allowed');} 
       
    note = await Notes.findByIdAndDelete(req.params.id)
    
    res.json({"success":"this note is deleted",note:note});
} catch (error) {
    console.error(error.message);
    res.status(500).send("some error has occured");
}
      })
module.exports = router;
