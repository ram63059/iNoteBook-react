import React, { useEffect,useRef , useContext,useState  } from 'react'
import {useNavigate} from 'react-router-dom';

import NoteContext from '../context/notes/noteContext'
import NoteItem from './NoteItem';
import AddNote from './AddNote';

export default function Notes(props) {
  let navigate=useNavigate();

    const context=useContext(NoteContext)

    const {notes,getNotes,editNote}=context;
    useEffect( () => {
      if(localStorage.getItem('token')){
        getNotes()
      }else{
        navigate("/login");
      }
       
        // eslint-disable-next-line 
        }, [])

    const ref=useRef(null)
    const refClose=useRef(null)
    const [note, setNote] = useState({id:"" ,etitle:"",edescription:"",etag:""})


    const updateNote=(currentNote)=>{
      ref.current.click();
      setNote({id:currentNote._id ,etitle:currentNote.title, edescription:currentNote.description,etag:currentNote.tag})
    }
    const onChange=(e)=>{
      
      setNote({...note,[e.target.name]:e.target.value})
    } 
  //   }
    const handleClick=(e)=>{
      console.log("updating the function",note)
      editNote(note.id,note.etitle,note.edescription,note.etag)
      refClose.current.click();
      e.preventDefault();
      props.showAlert("Updated  successfully","success")
    }
  
  
  return (
      <>
      <AddNote showAlert={props.showAlert}/>

      <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            <div className="mb-3">
            <label htmlFor="title" className="form-label">title</label>
            <input type="text" className="form-control" id="etitle" name='etitle' value={note.etitle} onChange={onChange} minLength={5} required aria-describedby="emailHelp"/>
            
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">description</label>
            <input type="text" className="form-control" id="edescription" name='edescription' value={note.edescription} onChange={onChange} minLength={5} required/>
          </div>
          <div className="mb-3">  
            <label htmlFor="tag" className="form-label">Tag</label>
            <input type="text" className="form-control" id="etag" name='etag' value={note.etag} onChange={onChange} minLength={5} required/>
          </div>
          
            </div>
            <div className="modal-footer">
              <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary"  onClick={handleClick} >Update Note</button>
            </div>
          </div>
        </div>
      </div>
    <div className="row my-3">
            <h1>Your  Notes</h1>
            {notes.map((note)=>{
            return <NoteItem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note}/>
            })}
    </div>
    </>
  )
 }