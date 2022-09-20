import React,{useContext, useEffect} from 'react'
import noteContext from '../context/notes/noteContext'

function About() {
    const a = useContext(noteContext)
    useEffect(()=>{
        a.update();
    },[])
  return (
    <div>Heloo {a.state.name} are you in {a.state.class}</div>
  )
}

export default About